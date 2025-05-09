import {
  AmqpChannel,
  createConnection,
} from "@notifications/configs/rabbitmq.config";
import { CLIENT_URL } from "@notifications/constants/env.constants";
import {
  getOrderPlacedTemplate,
  getOrderReceiptTemplate,
  getGenericTemplate,
  getOrderDeliveredTemplate,
  getOrderExtensionTemplate,
  getOrderExtensionApprovalTemplate,
  getCustomOfferTemplate,
} from "@notifications/utils/emailTemplates.util";
import { log } from "@notifications/utils/logger.util";
import { sendMail } from "@notifications/utils/sendMail.util";
import { ConsumeMessage } from "amqplib";
import {
  IOrderPlacedTemplateData,
  IOrderReceiptTemplateData,
  IGenericEmailTemplateData,
  IAuthEmailTemplates,
  IOrderDeliveredTemplateData,
  IOrderExtensionTemplateData,
  IOrderExtensionApprovalTemplateData,
  ICustomOfferTemplateData,
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
          total,
          originalDate,
          newDate,
          reason,
          type,
          deliveryDays,
          offerLink,
        }: {
          receiverEmail: string;
          template: IAuthEmailTemplates;
          amount: IEmailLocals["amount"];
          customerUsername: IEmailLocals["customerUsername"];
          contractorUsername: IEmailLocals["contractorUsername"];
          title: IEmailLocals["title"];
          description: IEmailLocals["description"];
          orderId: IEmailLocals["orderId"];
          orderDue: IEmailLocals["orderDue"];
          requirements: IEmailLocals["requirements"];
          orderUrl: IEmailLocals["orderUrl"];
          subject: IEmailLocals["subject"];
          header: IEmailLocals["header"];
          message: IEmailLocals["message"];
          serviceFee: IEmailLocals["serviceFee"];
          total: IEmailLocals["total"];
          originalDate: IEmailLocals["originalDate"];
          newDate: IEmailLocals["newDate"];
          reason: IEmailLocals["reason"];
          type: IEmailLocals["type"];
          deliveryDays: IEmailLocals["deliveryDays"];
          offerLink: IEmailLocals["offerLink"];
        } = JSON.parse(msg!.content.toString());
        // Common data for all templates
        const appIcon =
          "https://bigbusinessagency.com/hubfs/Product_Logo_Lockups_RGB_Logo_Centered_Service_Hub.webp";
        const baseTemplateData = {
          appLink: CLIENT_URL,
          appIcon,
        };

        if (template === "order-placed") {
          // Create order placed template data
          const orderPlacedData: IOrderPlacedTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? "",
            contractorUsername: contractorUsername ?? "",
            orderId: orderId ?? "",
            orderDue: orderDue ?? "",
            title: title ?? "",
            description: description ?? "",
            amount: amount ?? "0",
            requirements: requirements ?? "",
            orderUrl: orderUrl ?? CLIENT_URL,
          };

          // Create order receipt template data
          const orderReceiptData: IOrderReceiptTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? "",
            title: title ?? "",
            description: description ?? "",
            amount: amount ?? "0",
            serviceFee: serviceFee ?? "0",
            total: total ?? "0",
            orderUrl: orderUrl ?? CLIENT_URL,
            orderId: orderId ?? "",
          };

          await sendMail({
            to: receiverEmail,
            ...getOrderPlacedTemplate(orderPlacedData),
          });

          await sendMail({
            to: receiverEmail,
            ...getOrderReceiptTemplate(orderReceiptData),
          });
        } else if (template === "order-delivered") {
          const orderDeliveredData: IOrderDeliveredTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? "",
            title: title ?? "",
            contractorUsername: contractorUsername ?? "",
            orderUrl: orderUrl ?? CLIENT_URL,
          };

          await sendMail({
            to: receiverEmail,
            ...getOrderDeliveredTemplate(orderDeliveredData),
          });
        } else if (template === "order-extension") {
          const orderExtensionData: IOrderExtensionTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? "",
            contractorUsername: contractorUsername ?? "",
            originalDate: originalDate ?? "",
            newDate: newDate ?? "",
            reason: reason ?? "",
            orderUrl: orderUrl ?? CLIENT_URL,
          };

          await sendMail({
            to: receiverEmail,
            ...getOrderExtensionTemplate(orderExtensionData),
          });
        } else if (template === "order-extension-approval") {
          const orderExtensionApprovalData: IOrderExtensionApprovalTemplateData =
            {
              ...baseTemplateData,
              customerUsername: customerUsername ?? "",
              contractorUsername: contractorUsername ?? "",
              type: type ?? "",
              message: message ?? "",
              orderUrl: orderUrl ?? CLIENT_URL,
            };

          await sendMail({
            to: receiverEmail,
            ...getOrderExtensionApprovalTemplate(orderExtensionApprovalData),
          });
        } else if (template === "custom-offer") {
          const customOfferData: ICustomOfferTemplateData = {
            ...baseTemplateData,
            customerUsername: customerUsername ?? "",
            contractorUsername: contractorUsername ?? "",
            title: title ?? "",
            description: description ?? "",
            deliveryDays: deliveryDays ?? "0",
            amount: amount ?? "0",
            offerLink: offerLink ?? CLIENT_URL,
          };

          await sendMail({
            to: receiverEmail,
            ...getCustomOfferTemplate(customOfferData),
          });
        } else {
          const genericData: IGenericEmailTemplateData = {
            ...baseTemplateData,
            header: header ?? "Notification",
            message: message ?? "",
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
