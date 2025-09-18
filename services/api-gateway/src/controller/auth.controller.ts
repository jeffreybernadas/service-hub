import {
  signUpApi,
  signInApi,
  verifyEmailApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  getCurrentUserApi,
  resendVerificationEmailApi,
  refreshTokenApi,
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
// TODO: Improve ServiceResponse type

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
    });
  },
);

export const resetPasswordGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> =
      await resetPasswordApi(req.body, req.params.token);
    res.status(OK).json({
      message: response.data.data.message,
    });
  },
);

export const changePasswordGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> =
      await changePasswordApi(req.body);
    res.status(OK).json({
      message: response.data.data.message,
    });
  },
);

export const getCurrentUserGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> =
      await getCurrentUserApi();
    res.status(OK).json({
      message: response.data.data.message,
      user: response.data.data.user,
    });
  },
);

export const resendVerificationEmailGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> =
      await resendVerificationEmailApi(req.body);
    res.status(OK).json({
      message: response.data.data.message,
    });
  },
);

export const refreshTokenGatewayHandler = catchErrors(
  async (req: Request, res: Response) => {
    const response: ServiceResponse<SignUpResponseData> =
      await refreshTokenApi();
    req.session = { jwt: response.data.data.token };
    res.status(OK).json({
      message: response.data.data.message,
      user: response.data.data.user,
    });
  },
);
