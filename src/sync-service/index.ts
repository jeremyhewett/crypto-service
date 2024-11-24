import { initialize, syncPrices } from './sync-service';

initialize().then(async ({ coins, currencies }) => {
  syncPrices(coins, currencies).catch((err) => {
    console.error(`${new Date().toISOString()} Failed to sync data.\n${err}`);
  });
  setInterval(async () => {
    try {
      await syncPrices(coins, currencies);
    } catch (err) {
      console.error(`${new Date().toISOString()} Failed to sync data.\n${err}`);
    }
  }, 60000);
});
