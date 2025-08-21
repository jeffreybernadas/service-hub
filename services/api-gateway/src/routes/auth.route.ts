import { Router } from "express";
import {
  signupGatewayHandler,
  signinGatewayHandler,
  verifyEmailGatewayHandler,
  forgotPasswordGatewayHandler,
  resetPasswordGatewayHandler,
} from "@gateway/controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupGatewayHandler);
authRouter.post("/signin", signinGatewayHandler);
authRouter.put("/verify-email", verifyEmailGatewayHandler);
authRouter.put("/forgot-password", forgotPasswordGatewayHandler);
authRouter.put("/reset-password/:token", resetPasswordGatewayHandler);

export default authRouter;
