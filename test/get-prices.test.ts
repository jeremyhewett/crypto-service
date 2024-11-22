import 'dotenv/config';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { Application } from 'express';
import inject from 'light-my-request';
import { createApp, destroyApp } from '../src/server/app';

let app: Application;

describe('GET /prices endpoint', () => {
  before(async () => {
    app = await createApp();
  });

  after(async () => {
    await destroyApp();
  });

  it('Should return prices for given pair', async () => {
    const base = 'btc';
    const target = 'btc';
    const response = await inject(app, { method: 'GET', url: `/prices/${base}/${target}` });
    assert(response.statusCode === 200);
    const body = JSON.parse(response.body);
    assert(body instanceof Array && body.length > 1);
    assert(body[0].price === 1);
  });

  describe('When limit is specified', () => {

    it('Should return latest n prices for given pair', async () => {
      const base = 'btc';
      const target = 'btc';
      const limit = 1;
      const response = await inject(app, { method: 'GET', url: `/prices/${base}/${target}?limit=${limit}` });
      assert(response.statusCode === 200);
      const body = JSON.parse(response.body);
      assert(body instanceof Array && body.length === 1);
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
