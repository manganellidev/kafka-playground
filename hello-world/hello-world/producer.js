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

const run = async () => {
  await producer.connect();

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
