import { IEmailLocals } from "@jeffreybernadas/service-hub-helper";

export type IAuthEmailTemplates =
  | "verify-email"
  | "password-reset"
  | "password-reset-success"
  | "otp-verification"
  | "order-placed"
  | "order-receipt"
  | "order-delivered"
  | "order-extension"
  | "order-extension-approval"
  | "custom-offer"
  | "subscription-success"
  | "generic-mail";

/**
 * Interface for verify email template data
 */
export interface IVerifyEmailTemplateData extends IEmailLocals {
  url: string;
}

/**
 * Interface for password reset email template data
 */
export interface IPasswordResetTemplateData extends IEmailLocals {
  url: string;
  username: string;
}

/**
 * Interface for password reset success email template data
 */
export interface IPasswordResetSuccessTemplateData extends IEmailLocals {
  username: string;
}

/**
 * Interface for OTP verification email template data
 */
export interface IOTPVerificationTemplateData extends IEmailLocals {
  otp: string;
  username: string;
}

/**
 * Interface for order placed email template data
 */
export interface IOrderPlacedTemplateData extends IEmailLocals {
  customerUsername: string;
  contractorUsername: string;
  orderId: string;
  orderDue: string;
  title: string;
  description: string;
  amount: string;
  requirements: string;
  orderUrl: string;
}

/**
 * Interface for order receipt email template data
 */
export interface IOrderReceiptTemplateData extends IEmailLocals {
  customerUsername: string;
  title: string;
  description: string;
  amount: string;
  serviceFee: string;
  total: string;
  orderUrl: string;
  orderId: string;
}

/**
 * Interface for custom offer email template data
 */
export interface ICustomOfferTemplateData extends IEmailLocals {
  customerUsername: string;
  contractorUsername: string;
  title: string;
  description: string;
  deliveryDays: string;
  offerLink: string;
  amount: string;
}
/**
 * Interface for generic email template data
 */
export interface IGenericEmailTemplateData extends IEmailLocals {
  header: string;
  message: string;
  subject?: string;
  orderUrl?: string;
}
