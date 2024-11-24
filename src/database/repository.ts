import { getConnection } from './pg-pool';
import { timeWindow } from '../config';

export type PriceEntry = [string, string, number];

export async function insertPrices(prices: PriceEntry[]) {
  const timestamp = new Date().toISOString();

  console.log(`${timestamp} Inserting ${prices.length} price pairs`);

  let paramCount = 0;
  const query = `INSERT INTO prices
    ( base_symbol, target_symbol, price, timestamp )
    VALUES
    ${prices.map(() => `($${++paramCount}, $${++paramCount}, $${++paramCount}, '${timestamp}')`)}`;
  const params: any[] = [];
  prices.forEach(([baseSymbol, targetSymbol, price]) => {
    params.push(baseSymbol, targetSymbol, price);
  });
  await getConnection().query(query, params);
}

export async function updateStdDeviations(): Promise<void> {
  console.log(`${new Date().toISOString()} Refreshing std_deviations view`);
  const t0 = Date.now();
  await getConnection().query('REFRESH MATERIALIZED VIEW std_deviations');
  const t1 = Date.now();
  console.log(`${new Date().toISOString()} Refreshed std_deviations view in ${t1 - t0} ms`);
}

export async function deleteStalePrices(): Promise<void> {
  console.log(`${new Date().toISOString()} Deleting stale prices`);
  const query = `DELETE FROM prices WHERE timestamp < NOW() - INTERVAL '${timeWindow}'`;
  await getConnection().query(query);
}

const selectPricesQuery = `
  SELECT price, timestamp
  FROM prices
  WHERE base_symbol = $1
    AND target_symbol = $2
  ORDER BY timestamp DESC LIMIT $3
`;

export interface Price {
  price: number;
  timestamp: Date;
}

export async function selectPrices(baseSymbol: string, targetSymbol: string, limit: number | null = null): Promise<Price[]> {
  const result = await getConnection().query(selectPricesQuery, [baseSymbol, targetSymbol, limit]);
  return result.rows;
}

const selectPricesWithVolatilityQuery = `
  SELECT
    std_deviation,
    volatility_rank,
    timestamp
  FROM std_deviations
  LEFT JOIN (
      SELECT
        base_symbol,
        target_symbol,
        RANK() OVER (ORDER BY std_deviation DESC) AS volatility_rank
      FROM std_deviations
      WHERE std_deviation IS NOT NULL
    ) volatility_ranks
  ON volatility_ranks.base_symbol = std_deviations.base_symbol AND volatility_ranks.target_symbol = std_deviations.target_symbol
  WHERE std_deviations.base_symbol = $1 AND std_deviations.target_symbol = $2
`;

export interface Volatility {
  std_deviation: number;
  volatility_rank: number;
  timestamp: Date;
}

export async function selectVolatility(baseSymbol: string, targetSymbol: string): Promise<Volatility> {
  const result = await getConnection().query(selectPricesWithVolatilityQuery, [baseSymbol, targetSymbol]);
  const row = result.rows.length === 1 ? result.rows[0] : undefined;
  return row ? { ...row, volatility_rank: parseInt(row.volatility_rank) } : undefined;
}
