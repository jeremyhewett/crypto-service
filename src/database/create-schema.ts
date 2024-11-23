import { getConnection } from './pg-pool';
import { createPricesTableQuery, createStdDeviationsViewQuery } from './schema';

export async function createSchema() {
  await getConnection().query(createPricesTableQuery);
  await getConnection().query(createStdDeviationsViewQuery);
  console.log('Successfully created schema');
}

export async function exec() {
  await createSchema();
  await getConnection().end();
}
