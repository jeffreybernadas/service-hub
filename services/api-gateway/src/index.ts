import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "@jeffreybernadas/service-hub-helper";
import { APP_ORIGIN, PORT, SERVICE_NAME } from "@gateway/constants/env.constants";
import { API_VERSION, API_PREFIX } from "@gateway/constants/version.constants";
import { log } from "@gateway/utils/logger.util";
import healthCheckHandler from "@gateway/routes/health.route";
import enhancedResponse from "@gateway/middleware/enhancedResponse.middleware";
import { checkConnection } from "@gateway/utils/elasticsearch.util";
import { initializeApm } from "@gateway/utils/apm.util";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));

app.use(enhancedResponse);

app.get(`${API_PREFIX}/health`, healthCheckHandler);

app.use(errorHandler);

const startServer = async () => {
  await checkConnection();

  initializeApm();

  app.listen(PORT, () => {
    log.info(
      `API Gateway (${API_VERSION}) is running on port ${PORT}.`,
    );
  });
};

startServer().catch((error) => {
  log.error(`Failed to start ${SERVICE_NAME}:`, error);
  process.exit(1);
});