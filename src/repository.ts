import { getConnectionPool } from './pg-pool';
import { Coin, PriceMap } from './coin-gecko-service';

export async function insertPrices(prices: PriceMap) {
  const priceRows: [string, string, number][] = [];
  Object.entries(prices).forEach(([baseSymbol, prices]) => {
    Object.entries(prices).forEach(([targetSymbol, price]) => {
      priceRows.push([baseSymbol, targetSymbol, price]);
    });
  });
  const timestamp = new Date().toISOString();

  console.log(`${timestamp} Inserting ${priceRows.length} price pairs`);

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
  console.log(`${new Date().toISOString()} Refreshing std_deviations view`);
  const t0 = Date.now();
  await getConnectionPool().query('REFRESH MATERIALIZED VIEW CONCURRENTLY std_deviations');
  const t1 = Date.now();
  console.log(`${new Date().toISOString()} Refreshed std_deviations view in ${t1 - t0} ms`);
}

const selectPriceWithRankingQuery = `
SELECT
  prices.base_symbol,
  prices.target_symbol,
  prices.price,
  std_deviations.std_deviation,
  std_deviations.rank AS volatility_rank,
  prices.created_at
FROM prices
LEFT JOIN (
    SELECT
      base_symbol,
      target_symbol,
      std_deviations.std_deviation,
      RANK() OVER (ORDER BY std_deviations.std_deviation DESC) AS rank,
      updated_at
    FROM std_deviations
  ) std_deviations
ON std_deviations.base_symbol = prices.base_symbol AND std_deviations.target_symbol = prices.target_symbol
WHERE prices.base_symbol = $1
  AND prices.target_symbol = $2
  AND std_deviations.updated_at >= prices.created_at
ORDER BY prices.created_at DESC LIMIT 1
`;

export interface Price {
  base_symbol: string;
  target_symbol: string;
  price: number;
  std_deviation: number;
  rank: number;
  created_at: Date;
}

export async function selectLatestPriceWithRanking(baseSymbol: string, targetSymbol: string): Promise<Price | undefined> {
  const result = await getConnectionPool().query(selectPriceWithRankingQuery, [baseSymbol, targetSymbol]);
  return result.rows[0];
}
