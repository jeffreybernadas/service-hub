import { loadTemplate } from "./templateLoader.util";
import {
  OrderPlacedTemplateData,
  OrderReceiptTemplateData,
  GenericEmailTemplateData
} from "@notifications/types/email.types";

/**
 * Returns the password reset email template with the reset URL
 * @param url The password reset URL
 * @returns Email template object with subject, text, and HTML content
 */
export const getPasswordResetTemplate = (url: string) => ({
  subject: "Password Reset Request",
  text: `You requested a password reset. Click on the link to reset your password: ${url}`,
  html: loadTemplate("password-reset", { url }),
});

/**
 * Returns the email verification template with the verification URL
 * @param url The email verification URL
 * @returns Email template object with subject, text, and HTML content
 */
export const getVerifyEmailTemplate = (url: string) => ({
  subject: "Verify Email Address",
  text: `Click on the link to verify your email address: ${url}`,
  html: loadTemplate("verify-email", { url }),
});

/**
 * Returns the order placed email template
 * @param data The order placed template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderPlacedTemplate = (data: OrderPlacedTemplateData) => ({
  subject: `New Order from ${data.customerUsername}`,
  text: `You have received a new order from ${data.customerUsername}. Order #${data.orderId} is due ${data.orderDue}.`,
  html: loadTemplate("order-placed", data),
});

/**
 * Returns the order receipt email template
 * @param data The order receipt template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderReceiptTemplate = (data: OrderReceiptTemplateData) => ({
  subject: "Your Order Receipt",
  text: `Thank you for your order. Here's your receipt for order #${data.orderId}.`,
  html: loadTemplate("order-receipt", data),
});

/**
 * Returns a generic email template
 * @param data The generic email template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getGenericTemplate = (data: GenericEmailTemplateData) => ({
  subject: data.subject ?? "Notification from Service Hub",
  text: data.message ?? "You have a new notification from Service Hub.",
  html: loadTemplate("generic-mail", data),
});
