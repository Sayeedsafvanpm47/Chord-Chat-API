const amqp = require("amqplib");
const config = require("./config");

class Consumer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async ConsumerMessages(queueName,routingKey) {
    if (!this.channel) await this.createChannel();
    const exchangeName = config.rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, 'direct');
    const q = await this.channel.assertQueue(queueName);
    await this.channel.bindQueue(q.queue, exchangeName, routingKey);

    return new Promise((resolve, reject) => {
      this.channel.consume(q.queue, (msg) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString());
          console.log(data);
          this.channel.ack(msg);
          resolve(data); 
        }
      });
    });
  }
}

module.exports = Consumer;
