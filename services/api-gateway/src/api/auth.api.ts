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
