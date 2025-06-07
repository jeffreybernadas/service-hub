import { Request, Response } from "express";
import { catchErrors, OK } from "@jeffreybernadas/service-hub-helper";
import { log } from "@auth/utils/logger.util";

const healthCheckHandler = catchErrors(async (_req: Request, res: Response) => {
  log.info("Health check endpoint called");

  res.status(OK).json({
    status: "Auth Service is healthy.",
  });
});

export default healthCheckHandler;
