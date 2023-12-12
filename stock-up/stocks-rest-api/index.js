import express from 'express';
import KafkaClient from './lib/kafka-client/index.js';

const PORT = process.env.PORT || 4040;
const app = express();

app.use(express.json());

app.post('/stocks', async (req, res) => {
  const { ticker } = req.body;
  await producer.send({
    topic: `stock-${ticker}-price-topic`,
    messages: [{ value: JSON.stringify(req.body) }]
  });
  res.sendStatus(202);
});

const kafkaClient = KafkaClient.create();
const producer = kafkaClient.producer();

app.listen(PORT, async () => {
  await producer.disconnect();
  await producer.connect();
  console.log(`Server is running on port ${PORT}.`);
});

process.on('SIGINT', async () => {
  console.info('SIGINT signal received.');
  await producer.disconnect();
  process.exit(0);
});
