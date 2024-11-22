import { Coin, fetchCoins, fetchPrices, fetchVsCurrencies } from './coin-gecko-service';
import { cryptoExchangeId } from '../config';
import { deleteStalePrices, insertPrices, PriceEntry, updateStdDeviations } from '../database/repository';

async function initialize(): Promise<{ coins: Coin[], currencies: string[] }> {
  const coins = await fetchCoins(cryptoExchangeId);
  const currencies = await fetchVsCurrencies();
  console.log('Syncing prices for');
  console.log(`${coins.length} coins:\n`, coins.map(({ symbol }) => symbol).join(' '));
  console.log(`${currencies.length} currencies:\n`, currencies.join(' '));
  return { coins, currencies };
}

async function syncPrices(coins: Coin[], currencies: string[]) {
  console.log('Starting sync job execution...');
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
  console.log('Sync job execution complete.');
}

initialize() .then(({ coins, currencies }) => {
  syncPrices(coins, currencies);
  setInterval(() => syncPrices(coins, currencies), 60000);
});
