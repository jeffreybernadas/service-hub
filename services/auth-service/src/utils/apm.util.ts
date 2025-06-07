import {
  ELASTIC_APM_ENABLE,
  ELASTIC_APM_SERVER_URL,
  ELASTIC_APM_SECRET_TOKEN,
  NODE_ENV,
  SERVICE_NAME,
} from "@auth/constants/env.constants";
import apm from "elastic-apm-node";
import { log } from "@auth/utils/logger.util";

/**
 * Initialize Elastic APM agent
 * @returns The configured APM agent instance
 */
export const initializeApm = () => {
  // Only start APM if explicitly enabled via environment variable
  if (ELASTIC_APM_ENABLE === "0") {
    log.info("APM is disabled. Set ELASTIC_APM_ENABLE=1 to enable it.");
    return null;
  }

  try {
    const agent = apm.start({
      serviceName: SERVICE_NAME,
      serverUrl: ELASTIC_APM_SERVER_URL,
      secretToken: ELASTIC_APM_SECRET_TOKEN,
      environment: NODE_ENV === "development" ? "development" : "production",
      active: true,
      captureBody: "all",
      errorOnAbortedRequests: true,
      verifyServerCert: false,
      serviceVersion: "1.0.0",
      captureErrorLogStackTraces: "always",
    });

    log.info(`APM agent started for service: ${SERVICE_NAME}`);
    return agent;
  } catch (error) {
    log.error("Failed to start APM agent:", error);
    return null;
  }
};

export default apm;
