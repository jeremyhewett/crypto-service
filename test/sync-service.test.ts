import 'dotenv/config';
import { after, before, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import { initialize, syncPrices } from '../src/sync-service/sync-service';
import { Coin } from '../src/sync-service/coin-gecko-api';
import { createDatabase, dropDatabase, resetDatabase } from './test-helpers';
import { Client } from 'pg';
import { setConnection } from '../src/database/pg-pool';
import { insertPrices, selectPrices, updateStdDeviations } from '../src/database/repository';
import * as mockPrices from './mock-data/prices.json';

describe('Sync Service', () => {

  describe('initialize', () => {

    it('Should fetch a list of coins and a list of currencies from the CoinGecko API', async () => {
      const { coins, currencies } = await initialize();
      assert(coins.length > 0);
      assert(coins.length <= 100);
      const bitcoin = coins.find((coin) => coin.symbol === 'btc');
      assert(bitcoin) // Assuming bitcoin should always be in the coin list
      assert.deepStrictEqual(bitcoin, { coin_id: 'bitcoin', symbol: 'btc' } as Coin);
      assert(currencies.includes('usd')) // Assuming USD should always be in the currency list
    });

  });

  describe('syncPrices', () => {

    let testDb: string;
    let client: Client;

    before(async () => {
      testDb = await createDatabase();
      client = new Client({ database: testDb });
      await client.connect();
      setConnection(client);
      await insertPrices(mockPrices as any);
      await updateStdDeviations();
    });

    after(async () => {
      await client.end();
      await dropDatabase(testDb);
    });

    beforeEach(async () => {
      await resetDatabase();
    });

    it('Should sync prices from CoinGecko API to database', async () => {
      const coins = [{ coin_id: 'bitcoin', symbol: 'btc' }, { coin_id: 'ethereum', symbol: 'eth' }];
      const currencies = ['usd', 'btc'];
      let prices = await selectPrices('btc', 'usd');
      assert(prices.length === 0);
      await syncPrices(coins, currencies);
      prices = await selectPrices('btc', 'usd');
      assert(prices.length === 1);
    });

  });

});
