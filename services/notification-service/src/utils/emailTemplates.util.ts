import { loadTemplate } from "./templateLoader.util";

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
