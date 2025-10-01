import { AxiosResponse } from "axios";

export interface MicroservicesResponse<T = unknown> {
  service: string;
  appVersion: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime: string;
  url: string;
  data: T;
}

export type ServiceResponse<T = unknown> = AxiosResponse<MicroservicesResponse<T>>;
