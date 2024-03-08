import { mailConsumer } from "mail-consumer";

import express, { Express } from "express";
import { mqConnection } from "mq-connection";

export const setupApp = async (): Promise<Express> => {
  const app = express();
  app.post("/send-mail", async (req, res) => {
    const { to, subject, text } = req.body;
    const connection = mqConnection;
    await connection.sendToQueue("node-mailer-queue", { to, subject, text });
    res.send("Mail sent");
  });
  await mailConsumer();
  return app;
};
