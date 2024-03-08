import client, { Connection, Channel } from "amqplib";

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: boolean;

  async connect(): Promise<void> {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      this.connection = await client.connect(`amqp://${process.env.rmqHost}`);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error(error);
      console.error("Failed to connect to RabbitMQ server");
    }
  }

  async sendToQueue(queue: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        contentType: "application/json",
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const mqConnection = new RabbitMQConnection();
