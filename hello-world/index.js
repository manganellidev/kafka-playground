const { Kafka } = require("kafkajs");

process.on("SIGINT", async () => {
  console.info("SIGINT signal received.");
  await consumer.disconnect();
  await producer.disconnect();
  process.exit(0);
});

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["127.0.0.1:29092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  // Producing
  await producer.connect();

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });

  while (true) {
    await new Promise(async (res) => {
      await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS user!" }],
      });

      setTimeout(() => res(null), 3 * Math.random() * 5000);
    });
  }
};

run().catch(console.error);
