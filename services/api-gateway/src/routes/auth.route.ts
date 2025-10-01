import { Router } from "express";
import {
  signupGatewayHandler,
  signinGatewayHandler,
  verifyEmailGatewayHandler,
  forgotPasswordGatewayHandler,
  resetPasswordGatewayHandler,
  changePasswordGatewayHandler,
  resendVerificationEmailGatewayHandler,
  getCurrentUserGatewayHandler,
  refreshTokenGatewayHandler,
} from "@gateway/controller/auth.controller";
import {
  checkAuthentication,
  verifyUser,
} from "@gateway/middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signupGatewayHandler);
authRouter.post("/signin", signinGatewayHandler);
authRouter.put("/verify-email", verifyEmailGatewayHandler);
authRouter.put("/forgot-password", forgotPasswordGatewayHandler);
authRouter.put("/reset-password/:token", resetPasswordGatewayHandler);
authRouter.put(
  "/change-password",
  verifyUser,
  checkAuthentication,
  changePasswordGatewayHandler,
);
authRouter.get(
  "/me",
  verifyUser,
  checkAuthentication,
  getCurrentUserGatewayHandler,
);
authRouter.post(
  "/resend-email-verification",
  verifyUser,
  checkAuthentication,
  resendVerificationEmailGatewayHandler,
);

authRouter.get(
  "/refresh-token",
  verifyUser,
  checkAuthentication,
  refreshTokenGatewayHandler,
);

export default authRouter;
