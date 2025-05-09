import {
  AmqpChannel,
  createConnection,
} from "@notifications/configs/rabbitmq.config";
import { CLIENT_URL } from "@notifications/constants/env.constants";
import {
  getOrderPlacedTemplate,
  getOrderReceiptTemplate,
  getGenericTemplate
} from "@notifications/utils/emailTemplates.util";
import { log } from "@notifications/utils/logger.util";
import { sendMail } from "@notifications/utils/sendMail.util";
import { ConsumeMessage } from "amqplib";
import {
  IOrderPlacedTemplateData,
  IOrderReceiptTemplateData,
  IGenericEmailTemplateData,
  IAuthEmailTemplates
} from "@notifications/types/email.types";
import { IEmailLocals } from "@jeffreybernadas/service-hub-helper";

export const consumerOrderEmail = async (
  channel: AmqpChannel | undefined,
): Promise<void> => {
  const exchangeName = "service-hub-order-notification";
  const routingKey = "order-email";
  const queueName = "order-email-queue";
  try {
    channel ??= await createConnection();
    if (!channel) {
      log.error(
        `Error consuming message from queue order.email:`,
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
          template,
          amount,
          customerUsername,
          contractorUsername,
          title,
          description,
          orderId,
          orderDue,
          requirements,
          orderUrl,
          subject,
          header,
          message,
          serviceFee,
          total
        }: {
          receiverEmail: string;
          template: IAuthEmailTemplates;
          amount: IEmailLocals['amount'];
          customerUsername: IEmailLocals['customerUsername'];
          contractorUsername: IEmailLocals['contractorUsername'];
          title: IEmailLocals['title'];
          description: IEmailLocals['description'];
          orderId: IEmailLocals['orderId'];
          orderDue: IEmailLocals['orderDue'];
          requirements: IEmailLocals['requirements'];
          orderUrl: IEmailLocals['orderUrl'];
          subject: IEmailLocals['subject'];
          header: IEmailLocals['header'];
          message: IEmailLocals['message'];
          serviceFee: IEmailLocals['serviceFee'];
          total: IEmailLocals['total'];
        } = JSON.parse(msg!.content.toString());
        // Common data for all templates
        const baseTemplateData = {
          appLink: CLIENT_URL,
          appIcon: "https://i.ibb.co/Kyp2m0t/cover.png",
        };

        if (template === "order-placed") {
          // Create order placed template data
          const orderPlacedData: IOrderPlacedTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? '',
            contractorUsername: contractorUsername ?? '',
            orderId: orderId ?? '',
            orderDue: orderDue ?? '',
            title: title ?? '',
            description: description ?? '',
            amount: amount ?? '0',
            requirements: requirements ?? '',
            orderUrl: orderUrl ?? CLIENT_URL,
          };

          // Create order receipt template data
          const orderReceiptData: IOrderReceiptTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? '',
            title: title ?? '',
            description: description ?? '',
            amount: amount ?? '0',
            serviceFee: serviceFee ?? '0',
            total: total ?? '0',
            orderUrl: orderUrl ?? CLIENT_URL,
            orderId: orderId ?? '',
          };

          await sendMail({
            to: receiverEmail,
            ...getOrderPlacedTemplate(orderPlacedData),
          });

          await sendMail({
            to: receiverEmail,
            ...getOrderReceiptTemplate(orderReceiptData),
          });
        } else {
          const genericData: IGenericEmailTemplateData = {
            ...baseTemplateData,
            header: header ?? 'Notification',
            message: message ?? '',
            subject,
            orderUrl,
          };

          await sendMail({
            to: receiverEmail,
            ...getGenericTemplate(genericData),
          });
        }
        channel?.ack(msg!);
      },
    );
  } catch (error) {
    log.log(
      "error",
      "NotificationService EmailConsumer consumeOrderEmailMessages() method error:",
      error,
    );
  }
};
