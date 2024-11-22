import { Pool, Client } from 'pg';

let _connection: Client | Pool;

export function getConnection(): Client | Pool {
  if (!_connection) {
    _connection = new Pool();
  }
  return _connection;
}

export function setConnection(connection: Client) {
  _connection = connection;
}
