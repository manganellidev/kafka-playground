const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

process.on("SIGINT", async () => {
  console.info("SIGINT signal received.");
  await producer.disconnect();
  process.exit(0);
});

const kafka = new Kafka({
  clientId: "stocks-user",
  brokers: ["127.0.0.1:29092"],
});

const producer = kafka.producer();

app.post("/stocks-list", async (req, res) => {
  await producer.send({
    topic: `user-stocks-list-topic`,
    messages: [{ value: JSON.stringify(req.body) }],
  });
  res.sendStatus(202);
});

app.listen(PORT, async () => {
  await producer.connect();
  console.log(`Server is up on port ${PORT}`);
});
