import { Router } from "express";
import { signupHandler } from "@auth/controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupHandler);

export default authRouter;
