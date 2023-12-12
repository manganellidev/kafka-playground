import { Kafka } from 'kafkajs';

const CLIENT_ID = 'stock-up';
const BROKERS_URL = ['redpanda:9092'];

export default class KafkaClient extends Kafka {
  kafkaClient;

  constructor(clientId, brokers) {
    super({
      clientId: clientId,
      brokers: brokers
    });
  }

  static create(clientId = CLIENT_ID, brokers = BROKERS_URL) {
    this.kafkaClient = new KafkaClient(clientId, brokers);
    return this.kafkaClient;
  }
}
