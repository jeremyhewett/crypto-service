import 'dotenv/config';
import express from 'express';
import { selectPrices, selectVolatility } from '../database/repository';
import { getConnection } from '../database/pg-pool';

export async function createApp() {
  const app = express();

  app.get('/prices/:base/:target', async (req, res) => {
    const base = req.params['base'];
    const target = req.params['target'];
    const limitParam = req.query['limit'];

    if (limitParam && (typeof limitParam !== 'string' || !limitParam.match(/^[0-9]+$/))) {
      res.status(400).send('Invalid limit');
      return;
    }
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    try {
      const prices = await selectPrices(base, target, limit);
      res.json(prices);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  });

  app.get('/volatilities/:base/:target', async (req, res) => {
    const base = req.params['base'];
    const target = req.params['target'];

    try {
      const volatility = await selectVolatility(base, target);
      if (!volatility) {
        res.status(404).send('Volatility for given pair not found.');
      }
      res.json(volatility);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  });

  return app;
}

export async function destroyApp() {
  await getConnection().end();
}
