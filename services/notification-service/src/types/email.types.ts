import { IEmailLocals } from "@jeffreybernadas/service-hub-helper";

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
 * Interface for generic email template data
 */
export interface IGenericEmailTemplateData extends IEmailLocals {
  header: string;
  message: string;
  subject?: string;
  orderUrl?: string;
}
