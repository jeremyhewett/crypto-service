import { timeWindow } from '../config';

export const createPricesTableQuery = `
  CREATE TABLE IF NOT EXISTS "prices" (
    "base_symbol" VARCHAR NOT NULL,
    "target_symbol" VARCHAR NOT NULL,
    "price" REAL NOT NULL,
    "timestamp" TIMESTAMP NOT NULL
  );
  
  CREATE INDEX base_symbol_idx ON prices (base_symbol);
  CREATE INDEX target_symbol_idx ON prices (target_symbol);
`;

export const createStdDeviationsViewQuery = `
  CREATE MATERIALIZED VIEW std_deviations AS
    SELECT
        base_symbol,
        target_symbol,
        stddev(price) as std_deviation,
        CURRENT_TIMESTAMP AS timestamp
      FROM prices
      WHERE timestamp BETWEEN NOW() - INTERVAL '${timeWindow}' AND NOW()
      GROUP BY base_symbol, target_symbol;
  
  CREATE UNIQUE INDEX std_deviations_idx ON std_deviations (base_symbol, target_symbol);
`;
