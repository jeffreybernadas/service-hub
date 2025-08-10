import { Router } from "express";
import {
  signupGatewayHandler,
  signinGatewayHandler,
  verifyEmailGatewayHandler,
} from "@gateway/controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupGatewayHandler);
authRouter.post("/signin", signinGatewayHandler);
authRouter.put("/verify-email", verifyEmailGatewayHandler);

export default authRouter;
