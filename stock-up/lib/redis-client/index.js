import redis from 'redis';

export const RedisDatabaseEnum = {
  STOCKS: 0,
  NOTIFIER: 1
};

export default class RedisClient {
  redisClient;

  static async create(targetDatabase) {
    this.redisClient = await redis
      .createClient({
        url: `redis://:123456@127.0.0.1:6379/${targetDatabase}`
      })
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();
    return this.redisClient;
  }

  // static async upsert(key) {
  //   const found = await this.redisClient.get(key);

  //   if ()
  // }
}
