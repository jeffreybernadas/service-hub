/**
 * Base interface for all email templates
 */
export interface BaseEmailTemplateData {
  appLink: string;
  appIcon: string;
  [key: string]: unknown;
}

/**
 * Interface for order placed email template data
 */
export interface OrderPlacedTemplateData extends BaseEmailTemplateData {
  customerUsername: string;
  contractorUsername: string;
  orderId: string;
  orderDue: string;
  title: string;
  description: string;
  amount: string | number;
  requirements: string;
  orderUrl: string;
}

/**
 * Interface for order receipt email template data
 */
export interface OrderReceiptTemplateData extends BaseEmailTemplateData {
  customerUsername: string;
  title: string;
  description: string;
  amount: string | number;
  serviceFee: string | number;
  total: string | number;
  orderUrl: string;
  orderId: string; // Added this as it's used in the text template
}

/**
 * Interface for generic email template data
 */
export interface GenericEmailTemplateData extends BaseEmailTemplateData {
  header: string;
  message: string;
  subject?: string;
  orderUrl?: string;
}
