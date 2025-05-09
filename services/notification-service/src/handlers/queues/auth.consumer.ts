import {
  AmqpChannel,
  createConnection,
} from "@notifications/configs/rabbitmq.config";
import {
  IOTPVerificationTemplateData,
  IPasswordResetTemplateData,
  IVerifyEmailTemplateData,
} from "@notifications/types/email.types";
import {
  getOTPVerificationTemplate,
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "@notifications/utils/emailTemplates.util";
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
        const {
          receiverEmail,
          resetLink,
          verifyLink,
          template,
          appIcon,
          appLink,
          otp,
          username,
        } = JSON.parse(msg!.content.toString());

        if (template === "verify-email") {
          const templateData: IVerifyEmailTemplateData = {
            url: verifyLink,
            appIcon,
            appLink,
          };
          await sendMail({
            to: receiverEmail,
            ...getVerifyEmailTemplate(templateData),
          });
        } else if (template === "password-reset") {
          const templateData: IPasswordResetTemplateData = {
            url: resetLink,
            appIcon,
            appLink,
            username,
          };
          await sendMail({
            to: receiverEmail,
            ...getPasswordResetTemplate(templateData),
          });
        } else if (template === "otp-verification") {
          const templateData: IOTPVerificationTemplateData = {
            otp,
            appIcon,
            appLink,
            username,
          };
          await sendMail({
            to: receiverEmail,
            ...getOTPVerificationTemplate(templateData),
          });
        }
        channel?.ack(msg!);
      },
    );
  } catch (error) {
    log.error(`Error consuming message from queue auth.email:`, error);
  }
};
