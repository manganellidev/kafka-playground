import KafkaClient from './lib/kafka-client/index.js';
import { fetchPrice } from './lib/stocks-crawler/index.js';
import RedisClient, { RedisDatabaseEnum } from './lib/redis-client/index.js';

const kafkaClient = KafkaClient.create();
const producer = kafkaClient.producer();
const consumer = kafkaClient.consumer({ groupId: 'worker-stocks-price-group' });

process.on('SIGINT', async () => {
  console.info('SIGINT signal received.');
  await consumer.disconnect();
  await producer.disconnect();
  process.exit(0);
});

(async () => {
  const redisClient = await RedisClient.create(RedisDatabaseEnum.STOCKS);
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topics: [/^stock-[^-]+-price-topic$/],
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgData = JSON.parse(message.value.toString());

      const tickerPrice = await fetchPrice(msgData['ticker']);

      const foundTickerPrice = await redisClient.get(tickerPrice.ticker);

      if (!foundTickerPrice) {
        await redisClient.set(tickerPrice.ticker, tickerPrice.price ?? 0);
      } else if (tickerPrice.price && foundTickerPrice !== tickerPrice.price) {
        await redisClient.set(tickerPrice.ticker, tickerPrice.price);
      }
    }
  });
})();
