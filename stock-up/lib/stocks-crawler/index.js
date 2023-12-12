import fetchLastPrice from './crawler.js';

export const fetchPrices = async (tickers) => {
  const promises = [];
  for (const ticker of tickers) {
    promises.push(fetchPrice(ticker));
  }
  return Promise.all(promises);
};

export const fetchPrice = async (ticker) => {
  return fetchLastPrice(ticker);
};
