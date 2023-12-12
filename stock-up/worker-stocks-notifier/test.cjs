const Redis = require('ioredis');
const redis = new Redis();

const getAllKeysAndValues = async () => {
  let cursor = '0';

  do {
    const result = await redis.scan(cursor, 'MATCH', '*', 'COUNT', '100');
    const [nextCursor, keys] = result;

    for (const key of keys) {
      const value = await redis.get(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }

    cursor = nextCursor;
  } while (cursor !== '0');

  console.log('Done');
  redis.disconnect();
};

// Start the process
getAllKeysAndValues().catch((err) => {
  console.error(`Error: ${err}`);
  redis.disconnect();
});
