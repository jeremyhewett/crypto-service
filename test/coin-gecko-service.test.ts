import 'dotenv/config';
import fs from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert';

import { cryptoExchangeId } from '../src/config';
import { fetchCoins, fetchVsCurrencies, fetchPrices, Coin } from '../src/coin-gecko-service';

describe('Coin Gecko Service', () => {
  describe('fetchCoins', () => {

    it('Should return a list of coins for the given exchange', async () => {
      const coins = await fetchCoins(cryptoExchangeId);
      assert(coins.length > 0);
      assert(coins.length <= 100);
      const bitcoin = coins.find((coin) => coin.coin_id === 'bitcoin');
      assert.deepStrictEqual(bitcoin, { coin_id: 'bitcoin', symbol: 'btc' } as Coin);
      const ethereum = coins.find((coin) => coin.coin_id === 'ethereum');
      assert.deepStrictEqual(ethereum, { coin_id: 'ethereum', symbol: 'eth' } as Coin);
      fs.writeFileSync(`${__dirname}/mock-data/coins.json`, JSON.stringify(coins, null, 2));
    });

  });

  describe('fetchVsCurrencies', () => {

    it('Should return a list of currencies', async () => {
      const currencies = await fetchVsCurrencies();
      assert(currencies.length > 0);
      assert(currencies.includes('usd'));
      assert(currencies.includes('btc'));
      fs.writeFileSync(`${__dirname}/mock-data/currencies.json`, JSON.stringify(currencies, null, 2));
    });

  });


  describe('fetchPrices', () => {

    it('Should return the set of prices for the given coins and currencies', async () => {
      const coins = [{ coin_id: 'bitcoin', symbol: 'btc' }, { coin_id: 'ethereum', symbol: 'eth' }];
      const currencies = ['usd', 'btc'];
      const prices = await fetchPrices(coins, currencies);
      assert.deepEqual(new Set(Object.keys(prices)), new Set(['btc', 'eth']));
      assert.deepEqual(new Set(Object.keys(prices['btc'])), new Set(['usd', 'btc']));
      fs.writeFileSync(`${__dirname}/mock-data/prices.json`, JSON.stringify(prices, null, 2));
    });

  });

});
