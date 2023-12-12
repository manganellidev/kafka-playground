import axios from 'axios';

const parseLastPrice = (responseData) => {
  try {
    const reDataLastPrice = /data-last-price="([\d,]+(\.\d+)?)"/g;
    const dataLastPrice = responseData.match(reDataLastPrice);
    const reLastPrice = /[\d,]+(\.\d+)?/g;
    const lastPrice = dataLastPrice[0].match(reLastPrice);
    return parseFloat(lastPrice).toFixed(2);
  } catch (e) {
    console.error(e);
  }
};

const fetchLastPrice = async (ticker) => {
  try {
    const res = await axios.get(`https://www.google.com/finance/quote/${ticker}:BVMF`);
    return { ticker, price: parseLastPrice(res.data) };
  } catch (e) {
    console.error(e);
  }
};

export default fetchLastPrice;
