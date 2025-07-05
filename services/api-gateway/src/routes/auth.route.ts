import { Router } from "express";
import { signupGatewayHandler } from "@gateway/controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupGatewayHandler);

export default authRouter;
