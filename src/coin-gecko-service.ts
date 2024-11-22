import { apiKey } from './config';

const baseUrl = 'https://api.coingecko.com/api/v3';
const headers = {
  accept: 'application/json',
  'x-cg-demo-api-key': apiKey,
}

interface Ticker {
  base: string; // Uppercase symbol
  coin_id: string;
}

interface Exchange {
  tickers: Ticker[];
}

interface Coin {
  id: string;
  symbol: string;
}

export interface PriceMap {
  [symbol: string]: { [symbol: string]: number };
}

export async function fetchCoins(exchangeId: string): Promise<Coin[]> {
  const response = await fetch(`${baseUrl}/exchanges/${exchangeId}`, { headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const exchange = await response.json() as Exchange;
  const coinsById: { [coindId: string]: Coin } = {};
  for (const ticker of exchange.tickers) {
    coinsById[ticker.coin_id] = { id: ticker.coin_id, symbol: ticker.base.toLowerCase() };
  }
  return Object.values(coinsById);
}

export async function fetchVsCurrencies(): Promise<string[]> {
  const response = await fetch(`${baseUrl}/simple/supported_vs_currencies`, { headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

export async function fetchPrices(coins: Coin[], vsCurrencies: string[]): Promise<PriceMap> {
  const idsParam = encodeURIComponent(coins.map((coin) => coin.id).join(','));
  const currenciesParam = encodeURIComponent(vsCurrencies.join(','));
  const response = await fetch(`${baseUrl}/simple/price?ids=${idsParam}&vs_currencies=${currenciesParam}`, { headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const priceData = await response.json() as { [coinId: string]: { [symbol: string]: number; } };
  const symbolsByCoinId = Object.fromEntries(coins.map((coin) => [coin.id, coin.symbol]));
  const prices: PriceMap = {};
  for (const entry in priceData) {
    prices[symbolsByCoinId[entry]] = priceData[entry];
  }
  return prices;
}
