import { Request, Response } from "express";
import { catchErrors, OK } from "@jeffreybernadas/service-hub-helper";

const healthCheckHandler = catchErrors(async (_req: Request, res: Response) => {
  res.status(OK).json({
    status: "Auth Service is healthy.",
  });
});

export default healthCheckHandler;
