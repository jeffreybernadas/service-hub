import { Router } from "express";
import {
  signupGatewayHandler,
  signinGatewayHandler,
  verifyEmailGatewayHandler,
  forgotPasswordGatewayHandler,
} from "@gateway/controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupGatewayHandler);
authRouter.post("/signin", signinGatewayHandler);
authRouter.put("/verify-email", verifyEmailGatewayHandler);
authRouter.put("/forgot-password", forgotPasswordGatewayHandler);

export default authRouter;
