import axios from "axios";
import { sign } from "jsonwebtoken";
import { GATEWAY_JWT_TOKEN_SECRET } from "@gateway/constants/env.constants";

export const axiosCreateInstance = (
  baseUrl: string,
  serviceName?: string,
): ReturnType<typeof axios.create> => {
  let requestGatewayToken = "";
  if (serviceName) {
    requestGatewayToken = sign({ id: serviceName }, `${GATEWAY_JWT_TOKEN_SECRET}`);
  }
  const instance: ReturnType<typeof axios.create> = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      gatewayToken: requestGatewayToken,
    },
    withCredentials: true,
  });
  return instance;
};
