import { Router } from "express";
import healthCheckHandler from "@service-listing/controller/health.controller";

const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheckHandler);

export default healthCheckRouter;
