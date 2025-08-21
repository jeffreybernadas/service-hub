import {
  signUpApi,
  signInApi,
  verifyEmailApi,
  forgotPasswordApi,
} from "@gateway/api/auth.api";
import { ServiceResponse } from "@gateway/types/response.type";
import {
  catchErrors,
  CREATED,
  IAuthDocument,
  OK,
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

export const signinGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> = await signInApi(
      req.body,
    );
    req.session = { jwt: response.data.data.token };
    res.status(OK).json({
      message: response.data.data.message,
      user: response.data.data.user,
    });
  },
);

export const verifyEmailGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> = await verifyEmailApi(
      req.body,
    );
    res.status(OK).json({
      message: response.data.data.message,
      user: response.data.data.user,
    });
  },
);

export const forgotPasswordGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> =
      await forgotPasswordApi(req.body);
    res.status(OK).json({
      message: response.data.data.message,
      user: response.data.data.user,
    });
  },
);
