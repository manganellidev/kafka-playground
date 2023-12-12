import { fetchPrice, fetchPrices } from './index.js';

(async () => {
  const price = await fetchPrice('MGLU3');
  const prices = await fetchPrices(['PETR4', 'BBSE3']);

  console.log('\nfetchPrice: ', price);

  console.log('\nfetchPrices: ', prices);
})();
