import {
  appAssert,
  INTERNAL_SERVER_ERROR,
} from "@jeffreybernadas/service-hub-helper";
import resend from "@notifications/configs/resend.config";
import {
  EMAIL_SENDER,
  NODE_ENV,
  SERVICE_NAME,
} from "@notifications/constants/env.constants";
import { log } from "@notifications/utils/logger.util";

type SendMailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () => {
  return NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;
};

const getToEmail = (to: string) => {
  return NODE_ENV === "development" ? "delivered@resend.dev" : to;
};

export const sendMail = async ({ to, subject, text, html }: SendMailParams) => {
  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
  if (error) {
    appAssert(
      false,
      INTERNAL_SERVER_ERROR,
      `Error sending email to ${to} with subject ${subject}: ${error.message}`,
      SERVICE_NAME,
      "error",
    );
  }
  log.info(`Email sent to ${to} with subject ${subject}`);
  return data;
};
