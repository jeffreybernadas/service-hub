import { signUpApi } from "@gateway/api/auth.api";
import { ServiceResponse } from "@gateway/types/response.type";
import {
  catchErrors,
  CREATED,
  IAuthDocument,
} from "@jeffreybernadas/service-hub-helper";
import { Request, Response } from "express";

interface SignUpResponseData {
  message: string;
  user: IAuthDocument;
  token: string;
}

export const signupGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> = await signUpApi(
      req.body,
    );
    req.session = { jwt: response.data.data.token };
    res.status(CREATED).json({
      message: response.data.data.message,
      user: response.data.data.user,
    });
  },
);
