const amqp = require("amqplib");
const config = require("./config");

class Consumer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async ConsumerMessages(queueName, routingKey, handleMessage) {
    if (!this.channel) await this.createChannel();
    const exchangeName = config.rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, 'direct');
    const q = await this.channel.assertQueue(queueName);
    await this.channel.bindQueue(q.queue, exchangeName, routingKey);

    this.channel.consume(q.queue, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(data, 'data received');
        this.channel.ack(msg);
        handleMessage(data); 
      }
    });
  }
}

module.exports = Consumer;

