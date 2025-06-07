import { loadTemplate } from "@notifications/utils/templateLoader.util";
import {
  IOrderPlacedTemplateData,
  IOrderReceiptTemplateData,
  IGenericEmailTemplateData,
  IVerifyEmailTemplateData,
  IPasswordResetTemplateData,
  IOTPVerificationTemplateData,
  IPasswordResetSuccessTemplateData,
  ICustomOfferTemplateData,
  IOrderDeliveredTemplateData,
  IOrderExtensionApprovalTemplateData,
  IOrderExtensionTemplateData,
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
 * Returns the password reset success email template
 * @param data The password reset success template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getPasswordResetSuccessTemplate = (
  data: IPasswordResetSuccessTemplateData,
) => ({
  subject: "Password Reset Successful",
  text: `Your password has been successfully reset. You can now log in to your account using your new password.`,
  html: loadTemplate("password-reset-success", { data }),
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
export const getOTPVerificationTemplate = (
  data: IOTPVerificationTemplateData,
) => ({
  subject: "OTP Verification",
  text: `Your OTP is: ${data.otp}`,
  html: loadTemplate("otp-verification", { data }),
});

/**
 * Returns the custom offer email template
 * @param data The custom offer template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getCustomOfferTemplate = (data: ICustomOfferTemplateData) => ({
  subject: `New Custom Offer from ${data.contractorUsername}`,
  text: `You have received a new custom offer from ${data.contractorUsername}.`,
  html: loadTemplate("custom-offer", { data }),
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
 * Returns the order delivered email template
 * @param data The order delivered template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderDeliveredTemplate = (
  data: IOrderDeliveredTemplateData,
) => ({
  subject: "Your Order is Delivered",
  text: `Your order #${data.orderId} has been delivered. Please review the order.`,
  html: loadTemplate("order-delivered", { data }),
});

/**
 * Returns the order extension email template
 * @param data The order extension template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderExtensionTemplate = (
  data: IOrderExtensionTemplateData,
) => ({
  subject: "Order Extension Request",
  text: `The contractor ${data.contractorUsername} has requested an extension for your order #${data.orderId}.`,
  html: loadTemplate("order-extension", { data }),
});

/**
 * Returns the order extension approval email template
 * @param data The order extension approval template data
 * @returns Email template object with subject, text, and HTML content
 */
export const getOrderExtensionApprovalTemplate = (
  data: IOrderExtensionApprovalTemplateData,
) => ({
  subject: "Order Extension Approval",
  text: `The customer ${data.customerUsername} has ${data.type} your order extension request for order #${data.orderId}.`,
  html: loadTemplate("order-extension-approval", { data }),
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
