import { Pool } from 'pg';

let connectionPool: Pool;

export function getConnectionPool() {
  if (!connectionPool) {
    connectionPool = new Pool();
  }
  return connectionPool;
}
