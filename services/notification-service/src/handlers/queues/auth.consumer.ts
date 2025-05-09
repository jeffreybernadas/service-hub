import {
  AmqpChannel,
  createConnection,
} from "@notifications/configs/rabbitmq.config";
import { getVerifyEmailTemplate } from "@notifications/utils/emailTemplates.util";
import { log } from "@notifications/utils/logger.util";
import { sendMail } from "@notifications/utils/sendMail.util";
import { ConsumeMessage } from "amqplib";

export const consumerAuthEmail = async (
  channel: AmqpChannel | undefined,
): Promise<void> => {
  const exchangeName = "service-hub-auth-notification";
  const routingKey = "auth-email";
  const queueName = "auth-email-queue";
  try {
    channel ??= await createConnection();
    if (!channel) {
      log.error(
        `Error consuming message from queue auth.email:`,
        "Failed to create RabbitMQ channel",
      );
      return;
    }

    await channel.assertExchange(exchangeName, "direct");
    const serviceHubQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(serviceHubQueue.queue, exchangeName, routingKey);

    channel.consume(
      serviceHubQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const { receiverEmail, verifyLink } = JSON.parse(
          msg!.content.toString(),
        );
        await sendMail({
          to: receiverEmail,
          ...getVerifyEmailTemplate(verifyLink),
        });
        channel?.ack(msg!);
      },
    );
  } catch (error) {
    log.error(`Error consuming message from queue auth.email:`, error);
  }
};
