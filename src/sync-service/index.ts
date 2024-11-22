import { initialize, syncPrices } from './sync-service';

initialize() .then(({ coins, currencies }) => {
  syncPrices(coins, currencies);
  setInterval(() => syncPrices(coins, currencies), 60000);
});
