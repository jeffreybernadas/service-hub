import { Router } from "express";
import healthCheckHandler from "@gateway/controller/health.controller";

const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheckHandler);

export default healthCheckRouter;

