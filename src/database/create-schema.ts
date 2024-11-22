import { getConnectionPool } from '../pg-pool';
import { timeWindow } from '../config';

const createPricesTableQuery = `
CREATE TABLE IF NOT EXISTS "prices" (
  "base_symbol" VARCHAR NOT NULL,
  "target_symbol" VARCHAR NOT NULL,
  "price" REAL NOT NULL,
  "created_at" TIMESTAMP NOT NULL
);

CREATE INDEX base_symbol_idx ON prices (base_symbol);
CREATE INDEX target_symbol_idx ON prices (target_symbol);
`;

async function createPricesTable(): Promise<void> {
  await getConnectionPool().query(createPricesTableQuery);
}

const createStdDeviationsViewQuery = `
CREATE MATERIALIZED VIEW std_deviations AS
  SELECT
      base_symbol,
      target_symbol,
      stddev(price) as std_deviation,
      CURRENT_TIMESTAMP AS updated_at
    FROM prices
    WHERE created_at BETWEEN NOW() - INTERVAL '${timeWindow}' AND NOW()
    GROUP BY
      base_symbol,
      target_symbol;

CREATE UNIQUE INDEX std_deviations_idx ON std_deviations (base_symbol, target_symbol);
`;

async function createStdDeviationsView(): Promise<void> {
  await getConnectionPool().query(createStdDeviationsViewQuery);
}

createPricesTable()
  .then(() => createStdDeviationsView())
  .then(() => console.log('Successfully created'))
  .then(() => getConnectionPool().end());
