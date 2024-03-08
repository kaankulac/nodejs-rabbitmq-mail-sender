import amqlib from "amqplib";
import nodemailer from "nodemailer";

export const mailConsumer = async () => {
  let transport = nodemailer.createTransport(
    {
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    },
    {
      from: `Development Team <${process.env.MAIL_USER}>`,
    }
  );

  let connection = await amqlib.connect(`amqp://${process.env.RMQ_HOST}`);
  let channel = await connection.createChannel();
  await channel.assertQueue("node-mailer-queue", { durable: true });
  await channel.prefetch(1);
  channel.consume("node-mailer-queue", (data) => {
    if (data === null) return;
    let message = JSON.parse(data.content.toString());
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.error(err.stack);
        return channel.nack(data);
      }
      channel.ack(data);
    });
  });
};
