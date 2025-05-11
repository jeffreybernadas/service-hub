import { winstonLogger } from "@jeffreybernadas/service-hub-helper";
import {
  ELASTIC_SEARCH_URL,
  SERVICE_NAME,
} from "@notifications/constants/env.constants";
import { Logger } from "winston";

/**
 * Centralized logger instance for the notification service
 * Uses winston logger from the service-hub-helper package
 */
export const log: Logger = winstonLogger(
  `${ELASTIC_SEARCH_URL}`,
  SERVICE_NAME,
  "debug",
);
