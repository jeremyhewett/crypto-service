import express from 'express';
import { cryptoExchangeId } from './config';
import { getConnectionPool } from './pg-pool';
import { fetchCoins, fetchPrices, fetchVsCurrencies } from './coin-gecko-service';

export async function createApp() {
  const db = getConnectionPool();
  const app = express();

  const coins = await fetchCoins(cryptoExchangeId);
  const currencies = await fetchVsCurrencies();
  const prices = await fetchPrices(coins, currencies);

  app.get('/price', (req, res) => {
    const base = req.query['base'];
    const target = req.query['target'];
    if (typeof base !== 'string' || !base || typeof target !== 'string' || !target) {
      res.status(400).send('Specify base and target in query params');
      return;
    }
    const price = prices[base][target];
    if (typeof price !== 'number') {
      res.status(404).send('Combination not found');
      return;
    }
    res.json({ base, target, price });
  });

  return app;
}
