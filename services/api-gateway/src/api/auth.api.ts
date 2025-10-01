import { AxiosResponse } from "axios";
import { axiosCreateInstance } from "@gateway/utils/axios.util";
import { AUTH_BASE_URL } from "@gateway/constants/env.constants";
import { IAuth } from "@jeffreybernadas/service-hub-helper";

export const axiosAuthInstance = axiosCreateInstance(
  `${AUTH_BASE_URL}/api/v1/auth`,
  "auth",
);

export const signUpApi = async (body: IAuth): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.post("/signup", body);
  return response;
};

export const signInApi = async (body: IAuth): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.post("/signin", body);
  return response;
};

export const verifyEmailApi = async (body: IAuth): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.put(
    "/verify-email",
    body,
  );
  return response;
};

export const forgotPasswordApi = async (
  body: IAuth,
): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.put(
    "/forgot-password",
    body,
  );
  return response;
};

export const resetPasswordApi = async (
  body: IAuth,
  token: string,
): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.put(
    `/reset-password/${token}`,
    body,
  );
  return response;
};

export const changePasswordApi = async (
  body: IAuth,
): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.put(
    `/change-password`,
    body,
  );
  return response;
};

export const getCurrentUserApi = async (): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.get(`/me`);
  return response;
};

export const resendVerificationEmailApi = async (
  body: IAuth,
): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.post(
    `/resend-email-verification`,
    body,
  );
  return response;
};

export const refreshTokenApi = async (): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axiosAuthInstance.get(`/refresh-token`);
  return response;
};
