import { Request, Response } from "express";
import { catchErrors } from "@jeffreybernadas/service-hub-helper";
import { log } from "@notifications/utils/logger.util";

const healthCheckHandler = catchErrors(async (_req: Request, res: Response) => {
  log.info("Health check endpoint called");

  res.status(200).json({
    status: "Notification Service is healthy.",
  });
});

export default healthCheckHandler;
