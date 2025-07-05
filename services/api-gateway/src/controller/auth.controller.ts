import { signUpApi } from "@gateway/api/auth.api";
import { catchErrors, CREATED } from "@jeffreybernadas/service-hub-helper";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";

export const signupGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: AxiosResponse = await signUpApi(req.body);
    req.session = { jwt: response.data.token };
    res
      .status(CREATED)
      .json({ message: response.data.message, user: response.data.user });
  },
);
