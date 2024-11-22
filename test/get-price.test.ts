import 'dotenv/config';
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { Application } from 'express';
import inject from 'light-my-request';
import { createApp } from '../src/app';

let app: Application;

describe('GET /price endpoint', () => {
  before(async () => {
    app = await createApp();
  });

  it('Should return requested price', async () => {
    const base = 'btc';
    const target = 'btc';
    const response = await inject(app, { method: 'GET', url: `/price?base=${base}&target=${target}` });
    assert(response.statusCode === 200);
    const body = JSON.parse(response.body);
    assert.deepEqual(body, { base, target, price: 1, std_deviation: body.std_deviation, updated_at: body.updated_at });
  });

});
