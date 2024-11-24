import { Coin, fetchCoins, fetchPrices, fetchVsCurrencies } from './coin-gecko-api';
import { cryptoExchangeId } from '../config';
import { deleteStalePrices, insertPrices, PriceEntry, updateStdDeviations } from '../database/repository';

export async function initialize(): Promise<{ coins: Coin[], currencies: string[] }> {
  const coins = await fetchCoins(cryptoExchangeId);
  const currencies = await fetchVsCurrencies();
  console.log('Syncing prices for');
  console.log(`${coins.length} coins:\n`, coins.map(({ symbol }) => symbol).join(' '));
  console.log(`${currencies.length} currencies:\n`, currencies.join(' '));
  return { coins, currencies };
}

export async function syncPrices(coins: Coin[], currencies: string[]) {
  console.log(`${new Date().toISOString()} Starting data sync...`);
  const prices = await fetchPrices(coins, currencies);

  const priceRows: PriceEntry[] = [];
  Object.entries(prices).forEach(([baseSymbol, prices]) => {
    Object.entries(prices).forEach(([targetSymbol, price]) => {
      priceRows.push([baseSymbol, targetSymbol, price]);
    });
  });

  await insertPrices(priceRows);
  await updateStdDeviations();
  await deleteStalePrices();
  console.log(`${new Date().toISOString()} Data sync complete.`);
}
