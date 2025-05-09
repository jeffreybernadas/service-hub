import { loadTemplate } from "./templateLoader.util";
import {
  IOrderPlacedTemplateData,
  IOrderReceiptTemplateData,
  IGenericEmailTemplateData,
  IVerifyEmailTemplateData,
  IPasswordResetTemplateData,
  IOTPVerificationTemplateData
} from "@notifications/types/email.types";

/**
 * Returns the password reset email template with the reset URL
 * @param data The password reset template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getPasswordResetTemplate = (data: IPasswordResetTemplateData) => ({
  subject: "Password Reset Request",
  text: `You requested a password reset. Click on the link to reset your password: ${data.url}`,
  html: loadTemplate("password-reset", { data }),
});

/**
 * Returns the email verification template with the verification URL
 * @param data The email verification template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getVerifyEmailTemplate = (data: IVerifyEmailTemplateData) => ({
  subject: "Verify Email Address",
  text: `Click on the link to verify your email address: ${data.url}`,
  html: loadTemplate("verify-email", { data }),
});

/**
 * Returns the OTP verification email template
 * @param data The OTP verification template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOTPVerificationTemplate = (data: IOTPVerificationTemplateData) => ({
  subject: "OTP Verification",
  text: `Your OTP is: ${data.otp}`,
  html: loadTemplate("otp-verification", { data }),
});

/**
 * Returns the order placed email template
 * @param data The order placed template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderPlacedTemplate = (data: IOrderPlacedTemplateData) => ({
  subject: `New Order from ${data.customerUsername}`,
  text: `You have received a new order from ${data.customerUsername}. Order #${data.orderId} is due ${data.orderDue}.`,
  html: loadTemplate("order-placed", { data }),
});

/**
 * Returns the order receipt email template
 * @param data The order receipt template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderReceiptTemplate = (data: IOrderReceiptTemplateData) => ({
  subject: "Your Order Receipt",
  text: `Thank you for your order. Here's your receipt for order #${data.orderId}.`,
  html: loadTemplate("order-receipt", { data }),
});

/**
 * Returns a generic email template
 * @param data The generic email template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getGenericTemplate = (data: IGenericEmailTemplateData) => ({
  subject: data.subject ?? "Notification from Service Hub",
  text: data.message ?? "You have a new notification from Service Hub.",
  html: loadTemplate("generic-mail", { data }),
});
