import { getConnectionPool } from './pg-pool';
import { PriceMap } from './coin-gecko-service';

export async function insertPrices(prices: PriceMap) {
  const priceRows: [string, string, number][] = [];
  Object.entries(prices).forEach(([baseSymbol, prices]) => {
    Object.entries(prices).forEach(([targetSymbol, price]) => {
      priceRows.push([baseSymbol, targetSymbol, price]);
    });
  });

  const timestamp = new Date().toISOString();
  let paramCount = 0;
  const query = `INSERT INTO prices
    ( base_symbol, target_symbol, price, created_at )
    VALUES
    ${priceRows.map(() => `($${++paramCount}, $${++paramCount}, $${++paramCount}, '${timestamp}')`)}`;
  const params: any[] = [];
  priceRows.forEach(([baseSymbol, targetSymbol, price]) => {
    params.push(baseSymbol, targetSymbol, price);
  });
  await getConnectionPool().query(query, params);
}

export async function updateStdDeviations(): Promise<void> {
  await getConnectionPool().query('REFRESH MATERIALIZED VIEW CONCURRENTLY std_deviations');
}

const selectPriceWithRankingQuery = `
SELECT
  prices.base_symbol,
  prices.target_symbol,
  prices.price,
  std_deviations.stddev,
  std_deviations.rank AS volatility_rank,
  prices.created_at
FROM prices
JOIN (
    SELECT base_symbol, target_symbol, std_deviations.stddev, RANK() OVER (ORDER BY std_deviations.stddev DESC) AS rank, created_at
    FROM std_deviations
    WHERE std_deviations.stddev IS NOT null
  ) std_deviations
ON std_deviations.base_symbol = prices.base_symbol AND std_deviations.target_symbol = prices.target_symbol
WHERE prices.base_symbol = $1 AND prices.target_symbol = $2 AND std_deviations.created_at >= prices.created_at
ORDER BY prices.created_at DESC LIMIT 1
`;

export interface Price {
  base_symbol: string;
  target_symbol: string;
  price: number;
  stddev: number;
  rank: number;
  created_at: Date;
}

export async function selectLatestPriceWithRanking(baseSymbol: string, targetSymbol: string): Promise<Price | undefined> {
  const result = await getConnectionPool().query(selectPriceWithRankingQuery, [baseSymbol, targetSymbol]);
  return result.rows[0];
}
