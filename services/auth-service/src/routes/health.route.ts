import { Router } from "express";
import healthCheckHandler from "@auth/controller/health.controller";

const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheckHandler);

export default healthCheckRouter;
