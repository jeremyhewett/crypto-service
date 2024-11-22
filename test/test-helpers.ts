import crypto from 'crypto';
import { Client } from 'pg';
import { getConnection, setConnection } from '../src/database/pg-pool';
import { createSchema } from '../src/database/create-schema';
import { updateStdDeviations } from '../src/database/repository';

export async function createDatabase() {
  const dbName = `test_${crypto.randomBytes(4).toString('hex')}`;
  let client = new Client();
  await client.connect()
  await client.query(`CREATE DATABASE ${dbName}`);
  await client.end();
  client = new Client({ database: dbName });
  await client.connect();
  setConnection(client);
  await createSchema();
  await client.end();
  return dbName;
}

export async function dropDatabase(dbName: string) {
  let client = new Client();
  await client.connect()
  try {
    await client.query(`DROP DATABASE ${dbName}`);
  } catch(err) {
    console.error(err);
  }
  await client.end();
}

export async function resetDatabase() {
  await getConnection().query('DELETE FROM prices');
  await updateStdDeviations();
}

export function floatEquals(a: number, b: number): boolean {
  const tolerance = 0.00001;
  return Math.abs(a - b) < tolerance;
}
