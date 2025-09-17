import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  resendVerificationEmail,
  resetPassword,
  signinHandler,
  signupHandler,
  verifyEmail,
} from "@auth/controller/auth.controller";
import { GATEWAY_JWT_TOKEN_SECRET } from "@auth/constants/env.constants";
import { verifyGatewayRequest } from "@jeffreybernadas/service-hub-helper";

const authRouter = Router();

authRouter.post(
  "/signup",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  signupHandler,
);
authRouter.post(
  "/signin",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  signinHandler,
);

authRouter.put(
  "/verify-email",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  verifyEmail,
);

authRouter.put(
  "/forgot-password",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  forgotPassword,
);

authRouter.put(
  "/reset-password/:token",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  resetPassword,
);

authRouter.put(
  "/change-password",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  changePassword,
);

authRouter.get(
  "/me",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  getCurrentUser,
);

authRouter.post(
  "/resend-email-verification",
  verifyGatewayRequest(GATEWAY_JWT_TOKEN_SECRET),
  resendVerificationEmail,
);

export default authRouter;
