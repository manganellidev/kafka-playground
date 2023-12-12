import RedisClient, { RedisDatabaseEnum } from '../lib/redis-client/index.js';
import redis from 'redis';

export const scanNow = async (pattern, amountPerScan) => {
  const redisClient = await redis.createClient().connect();

  return new Promise((resolve, reject) => {
    let cursor = '0';
    let keys = [];
    function scan() {
      console.log('here');
      redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', amountPerScan, function (err, reply) {
        console.log('here 2');
        if (err) {
          reject(err);
        }
        cursor = reply[0];
        const keysScan = reply[1];

        if (keysScan.length) {
          keys = keys.concat(keysScan);
        }

        console.log('here 3');
        if (cursor === '0') {
          return resolve(keys);
        } else {
          return scan();
        }
      });
    }
    console.log('here 4');
    scan();
  });
};
