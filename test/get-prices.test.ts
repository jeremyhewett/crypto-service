import 'dotenv/config';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { Application } from 'express';
import inject from 'light-my-request';
import { createApp, destroyApp } from '../src/server/app';
import { createDatabase, dropDatabase } from './test-helpers';
import { Client } from 'pg';
import { setConnection } from '../src/database/pg-pool';
import { insertPrices, updateStdDeviations } from '../src/database/repository';
import * as mockPrices from './mock-data/prices.json';

let testDb: string;
let client: Client;
let app: Application;

describe('GET /prices endpoint', () => {

  before(async () => {
    testDb = await createDatabase();
    client = new Client({ database: testDb });
    await client.connect();
    setConnection(client);
    app = await createApp();
    await insertPrices(mockPrices as any);
    await updateStdDeviations();
  });

  after(async () => {
    await destroyApp();
    await dropDatabase(testDb);
  });

  it('Should return prices for requested pair', async () => {
    const base = 'bnt';
    const target = 'btc';
    const response = await inject(app, { method: 'GET', url: `/prices/${base}/${target}` });
    assert(response.statusCode === 200);
    const body = JSON.parse(response.body);
    assert(body.length === 3);
    assert(body[0].price === 5);
    assert(body[1].price === 8);
    assert(body[2].price === 3);
  });

  describe('When limit is specified', () => {

    it('Should return latest n prices for given pair', async () => {
      const base = 'btc';
      const target = 'btc';
      const limit = 1;
      const response = await inject(app, { method: 'GET', url: `/prices/${base}/${target}?limit=${limit}` });
      assert(response.statusCode === 200);
      const body = JSON.parse(response.body);
      assert(body instanceof Array && body.length === limit);
    });

    it('Should return 400 for invalid value', async () => {
      const base = 'btc';
      const target = 'btc';
      const limit = 'invalid';
      const response = await inject(app, { method: 'GET', url: `/prices/${base}/${target}?limit=${limit}` });
      assert(response.statusCode === 400);
    });

  });

});
