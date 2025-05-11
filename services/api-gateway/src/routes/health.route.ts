import { Request, Response } from "express";
import { catchErrors } from "@jeffreybernadas/service-hub-helper";
import { log } from "@gateway/utils/logger.util";

const healthCheckHandler = catchErrors(async (_req: Request, res: Response) => {
  log.info("Health check endpoint called");

  res.status(200).json({
    status: "API Gateway is healthy.",
  });
});

export default healthCheckHandler;
