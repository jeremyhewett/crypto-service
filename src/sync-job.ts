import { Coin, fetchCoins, fetchPrices, fetchVsCurrencies } from './coin-gecko-service';
import { cryptoExchangeId } from './config';
import { insertPrices, updateStdDeviations } from './repository';

async function initialize(): Promise<{ coins: Coin[], currencies: string[] }> {
  const coins = await fetchCoins(cryptoExchangeId);
  const currencies = await fetchVsCurrencies();
  console.log('Syncing prices for');
  console.log(`${coins.length} coins:\n`, coins.map(({ symbol }) => symbol).join(' '));
  console.log(`${currencies.length} currencies:\n`, currencies.join(' '));
  return { coins, currencies };
}

async function syncPrices(coins: Coin[], currencies: string[]) {
  const prices = await fetchPrices(coins, currencies);
  await insertPrices(prices);
  await updateStdDeviations();
}

initialize() .then(({ coins, currencies }) => {
  syncPrices(coins, currencies);
  setInterval(() => syncPrices(coins, currencies), 60000);
});
