const { Kafka } = require("kafkajs");
const redis = require("redis");
const syncPrices = require("./crawler");

const tickers = [
  "PETR4",
  "ITSA4",
  "TAEE11",
  "MGLU3",
  "TRIS3",
  "WIZC3",
  "POMO4",
  "MDIA3",
  "BBSE3",
  "FESA4",
];

process.on("SIGINT", async () => {
  console.info("SIGINT signal received.");
  await producer.disconnect();
  process.exit(0);
});

const kafka = new Kafka({
  clientId: "stocks-monitor",
  brokers: ["127.0.0.1:29092"],
});

const producer = kafka.producer();

const run = async () => {
  const redisClient = await redis
    .createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await producer.connect();

  while (true) {
    await new Promise(async (res) => {
      const tickerPrices = await syncPrices(tickers);
      const tickersToBeQueued = [];

      for (const ticker of tickerPrices) {
        if (ticker.price !== (await redisClient.get(ticker.ticker))) {
          await redisClient.set(ticker.ticker, ticker.price);
          tickersToBeQueued.push(ticker);
        }
      }

      if (tickersToBeQueued.length) {
        const queuePromises = [];
        for (const ticker of tickersToBeQueued) {
          queuePromises.push(
            await producer.send({
              topic: `stocks-monitor-${ticker.ticker}-topic`,
              messages: [{ value: JSON.stringify(ticker) }],
            })
          );
        }
        await Promise.all(queuePromises);
      }

      setTimeout(() => res(null), 10000);
    });
  }
};

run().catch(console.error);
