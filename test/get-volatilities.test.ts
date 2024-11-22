import { after, before, describe, it } from 'node:test';
import inject from 'light-my-request';
import assert from 'node:assert';
import { createApp, destroyApp } from '../src/server/app';
import { Application } from 'express';

let app: Application;

describe('GET /volatilities endpoint', () => {
  before(async () => {
    app = await createApp();
  });

  after(async () => {
    await destroyApp();
  });

  it('Should return requested volatility', async () => {
    const base = 'btc';
    const target = 'btc';
    const response = await inject(app, { method: 'GET', url: `/volatilities/${base}/${target}` });
    assert(response.statusCode === 200);
    const body = JSON.parse(response.body);
    assert(body.std_deviation === 0);
    assert(typeof body.volatility_rank === 'number');
  });

  it('Should return 404 for non-existant pair', async () => {
    const base = 'btc';
    const target = 'unknownsymbol';
    const response = await inject(app, { method: 'GET', url: `/volatilities/${base}/${target}` });
    assert(response.statusCode === 404);
  });

});
