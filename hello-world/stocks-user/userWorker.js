const { Kafka } = require("kafkajs");
const syncPrices = require("./crawler");

process.on("SIGINT", async () => {
  console.info("SIGINT signal received.");
  await consumer.disconnect();
  await producer.disconnect();
  process.exit(0);
});

const kafka = new Kafka({
  clientId: "stocks-user",
  brokers: ["127.0.0.1:29092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "user-stocks-list-group" });
const usersList = [];

const run = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: "user-stocks-list-topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(message.value.toString());
      const msgData = JSON.parse(message.value.toString());

      //validate if has difference
      usersList.push(msgData);

      const tickerPrices = await syncPrices(msgData["tickers"]);
      for (const ticker of tickerPrices) {
        await producer.send({
          topic: `monitor-stocks-${ticker.ticker}-topic`,
          messages: [{ value: JSON.stringify(ticker) }],
        });
      }
    },
  });
};

run().catch(console.error);
