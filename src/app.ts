import express from 'express';
import { cryptoExchangeId } from './config';
import { fetchCoins, fetchPrices, fetchVsCurrencies } from './coin-gecko-service';
import { insertPrices, selectLatestPriceWithRanking, updateStdDeviations } from './repository';
import { PriceResponse } from './PriceResponse';

export async function createApp() {
  const app = express();

  const coins = await fetchCoins(cryptoExchangeId);
  const currencies = await fetchVsCurrencies();
  const prices = await fetchPrices(coins, currencies);

  await insertPrices(prices);
  await updateStdDeviations();

  app.get('/price', async (req, res) => {
    const base = req.query['base'];
    const target = req.query['target'];
    if (typeof base !== 'string' || !base || typeof target !== 'string' || !target) {
      res.status(400).send('Specify base and target in query params');
      return;
    }
    const price = await selectLatestPriceWithRanking(base, target);
    if (!price) {
      res.status(404).send('Combination not found');
      return;
    }
    res.json(new PriceResponse(price));
  });

  return app;
}
