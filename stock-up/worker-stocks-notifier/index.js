import cron from 'node-cron';
import RedisClient, { RedisDatabaseEnum } from '../lib/redis-client/index.js';
import { scanNow } from './scan.js';

// cron.schedule('*/1 * * * *', () => {
//   console.log('running!');

// });

(async () => {
  await scanNow('STOCK-*', '10').then((keys) => {
    console.log(JSON.stringify(keys));
  });
})();
