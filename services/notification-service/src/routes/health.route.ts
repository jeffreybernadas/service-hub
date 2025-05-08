import { Request, Response } from "express";
import { catchErrors } from "@jeffreybernadas/service-hub-helper";
import { sendMail } from "@notifications/utils/sendMail.util";
import { getVerifyEmailTemplate } from "@notifications/utils/emailTemplates.util";

const healthCheckHandler = catchErrors(async (_req: Request, res: Response) => {
  const { error } = await sendMail({
    to: "test@gmail.com",
    ...getVerifyEmailTemplate("http://localhost:3000"),
  });
  res.status(200).json({
    status: "Notification Service is healthy.",
  });
});

export default healthCheckHandler;
