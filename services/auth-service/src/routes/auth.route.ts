import { Router } from "express";
import {
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

export default authRouter;
