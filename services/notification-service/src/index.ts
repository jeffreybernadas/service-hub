import "dotenv/config";
// Import APM first but don't initialize it yet - we'll do that after Elasticsearch connects
import { initializeApm } from "@notifications/utils/apm.util";
import express from "express";
import cors from "cors";
import { errorHandler } from "@jeffreybernadas/service-hub-helper";
import healthCheckRouter from "@notifications/routes/health.route";
import {
  APP_ORIGIN,
  PORT,
  SERVICE_NAME,
} from "@notifications/constants/env.constants";
import {
  API_PREFIX,
  API_VERSION,
} from "@notifications/constants/version.constant";
import { checkConnection } from "@notifications/utils/elasticsearch.util";
import { log } from "@notifications/utils/logger.util";
import enhancedResponse from "@notifications/middleware/enhancedResponse.middleware";
import { createConnection } from "@notifications/configs/rabbitmq.config";
import { consumerAuthEmail } from "./handlers/queues/auth.consumer";
import { consumerOrderEmail } from "./handlers/queues/order.consumer";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));

app.use(enhancedResponse);

app.use(`${API_PREFIX}/health`, healthCheckRouter);

app.use(errorHandler);

const startServer = async () => {
  // First establish connection to RabbitMQ
  const channel = await createConnection();
  await consumerAuthEmail(channel);
  await consumerOrderEmail(channel);

  // First establish connection to Elasticsearch
  await checkConnection();

  // Initialize APM after Elasticsearch is connected
  initializeApm();

  app.listen(PORT, () => {
    log.info(
      `Notification Service (${API_VERSION}) is running on port ${PORT}.`,
    );
  });
};

startServer().catch((error) => {
  log.error(`Failed to start ${SERVICE_NAME}:`, error);
  process.exit(1);
});
