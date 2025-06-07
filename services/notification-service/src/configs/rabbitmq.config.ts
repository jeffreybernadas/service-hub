import amqplib from "amqplib";
import {
  RABBITMQ_ENDPOINT,
  SERVICE_NAME,
} from "@notifications/constants/env.constants";
import { log } from "@notifications/utils/logger.util";

/**
 * Infer the types of the connection and channel from amqplib due to
 * type inference issues of v0.10.8 and v0.10.7 types.
 * @see https://stackoverflow.com/questions/79519639/typescript-error-when-using-amqplib-that-cant
 */
export type AmqpConnection =
  ReturnType<typeof amqplib.connect> extends Promise<infer T> ? T : never;
export type AmqpChannel =
  ReturnType<AmqpConnection["createChannel"]> extends Promise<infer T>
    ? T
    : never;

/**
 * Establishes a connection to RabbitMQ
 * @returns Promise resolving to the RabbitMQ connection
 */
export const createConnection = async (): Promise<AmqpChannel | undefined> => {
  try {
    const connection: AmqpConnection = await amqplib.connect(RABBITMQ_ENDPOINT);
    const channel: AmqpChannel = await connection.createChannel();

    log.info(`RabbitMQ connection established for ${SERVICE_NAME}`);
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.error(`Failed to connect to RabbitMQ in ${SERVICE_NAME}:`, error);
    return undefined;
  }
};

/**
 * Gracefully closes the RabbitMQ connection and channel
 * @param channel - The RabbitMQ channel
 * @param connection - The RabbitMQ connection
 */
export const closeConnection = (
  channel: AmqpChannel,
  connection: AmqpConnection,
): void => {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
};
