import { IEmailLocals } from "@jeffreybernadas/service-hub-helper";
import {
  AmqpChannel,
  createConnection,
} from "@notifications/configs/rabbitmq.config";
import { CLIENT_URL } from "@notifications/constants/env.constants";
import {
  IAuthEmailTemplates,
  IOTPVerificationTemplateData,
  IPasswordResetSuccessTemplateData,
  IPasswordResetTemplateData,
  IVerifyEmailTemplateData,
} from "@notifications/types/email.types";
import {
  getOTPVerificationTemplate,
  getPasswordResetSuccessTemplate,
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
          otp,
          username,
        }: {
          template: IAuthEmailTemplates;
          receiverEmail: string;
          resetLink: IEmailLocals["resetLink"];
          verifyLink: IEmailLocals["verifyLink"];
          otp: IEmailLocals["otp"];
          username: IEmailLocals["username"];
        } = JSON.parse(msg!.content.toString());

        // Common data for all templates
        const appIcon =
          "https://bigbusinessagency.com/hubfs/Product_Logo_Lockups_RGB_Logo_Centered_Service_Hub.webp";
        const baseTemplateData = {
          appLink: CLIENT_URL,
          appIcon,
        };

        if (template === "verify-email") {
          const templateData: IVerifyEmailTemplateData = {
            ...baseTemplateData,
            url: verifyLink ?? CLIENT_URL,
          };
          await sendMail({
            to: receiverEmail,
            ...getVerifyEmailTemplate(templateData),
          });
        } else if (template === "password-reset") {
          const templateData: IPasswordResetTemplateData = {
            ...baseTemplateData,
            url: resetLink ?? CLIENT_URL,
            username: username ?? "",
          };
          await sendMail({
            to: receiverEmail,
            ...getPasswordResetTemplate(templateData),
          });
        } else if (template === "otp-verification") {
          const templateData: IOTPVerificationTemplateData = {
            ...baseTemplateData,
            otp: otp ?? "",
            username: username ?? "",
          };
          await sendMail({
            to: receiverEmail,
            ...getOTPVerificationTemplate(templateData),
          });
        } else if (template === "password-reset-success") {
          const templateData: IPasswordResetSuccessTemplateData = {
            ...baseTemplateData,
            username: username ?? "",
          };
          await sendMail({
            to: receiverEmail,
            ...getPasswordResetSuccessTemplate(templateData),
          });
        }
        channel?.ack(msg!);
      },
    );
  } catch (error) {
    log.error(`Error consuming message from queue auth.email:`, error);
  }
};
