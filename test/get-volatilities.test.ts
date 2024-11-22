import { after, before, describe, it } from 'node:test';
import { Application } from 'express';
import { Client } from 'pg';
import inject from 'light-my-request';
import assert from 'node:assert';
import { createApp, destroyApp } from '../src/server/app';
import { setConnection } from '../src/database/pg-pool';
import { createDatabase, dropDatabase, floatEquals } from './test-helpers';
import { insertPrices, updateStdDeviations } from '../src/database/repository';
import * as mockPrices from './mock-data/prices.json';
import * as mockStdDeviations from './mock-data/std_deviations.json';

let testDb: string;
let client: Client;
let app: Application;

describe('GET /volatilities endpoint', () => {
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

  it('Should return requested volatility', async () => {
    const base = 'eth';
    const target = 'eur';
    const response = await inject(app, { method: 'GET', url: `/volatilities/${base}/${target}` });
    assert(response.statusCode === 200);
    const body = JSON.parse(response.body);
    assert(floatEquals(body.std_deviation, mockStdDeviations[base][target]));
  });

  it('Should rank volatilities correctly', async () => {
    const etheur = JSON.parse((await inject(app, { method: 'GET', url: `/volatilities/eth/eur` })).body);
    const bntbtc = JSON.parse((await inject(app, { method: 'GET', url: `/volatilities/bnt/btc` })).body);
    const btcbtc = JSON.parse((await inject(app, { method: 'GET', url: `/volatilities/btc/btc` })).body);
    assert(etheur.volatility_rank === 2);
    assert(bntbtc.volatility_rank === 1);
    assert(btcbtc.volatility_rank === 3);
  });

  it('Should return 404 for non-existant pair', async () => {
    const base = 'btc';
    const target = 'unknownsymbol';
    const response = await inject(app, { method: 'GET', url: `/volatilities/${base}/${target}` });
    assert(response.statusCode === 404);
  });

});
