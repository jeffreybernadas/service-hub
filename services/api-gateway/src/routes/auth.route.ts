import { Router } from "express";
import {
  signupGatewayHandler,
  signinGatewayHandler,
} from "@gateway/controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupGatewayHandler);
authRouter.post("/signin", signinGatewayHandler);

export default authRouter;
