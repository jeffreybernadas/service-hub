import { Channel } from "amqplib";
import { createConnection } from "@auth/config/rabbitmq.config";
import { log } from "@auth/utils/logger.util";
import { SERVICE_NAME } from "@auth/constants/env.constants";

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string,
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, "direct");
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.error(
      `${SERVICE_NAME} Provider publishDirectMessage() error: ${error}`,
    );
  }
}
