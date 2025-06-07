import "dotenv/config";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import {
  GATEWAY_URL,
  JWT_TOKEN_SECRET,
  PORT,
  SERVICE_NAME,
} from "@auth/constants/env.constants";
import { API_PREFIX, API_VERSION } from "@auth/constants/version.constant";
import healthCheckRouter from "@auth/routes/health.route";
import { log } from "@auth/utils/logger.util";
import enhancedResponse from "@auth/middleware/enhancedResponse.middleware";
import {
  errorHandler,
  IAuthPayload,
} from "@jeffreybernadas/service-hub-helper";
import { verify } from "jsonwebtoken";
import compression from "compression";
import { checkConnection } from "@auth/utils/elasticsearch.util";
import { initializeApm } from "@auth/utils/apm.util";
import { AmqpChannel, createConnection } from "@auth/config/rabbitmq.config";

const app = express();
let _channel: AmqpChannel | undefined;

export const getChannel = (): AmqpChannel | undefined => _channel;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
  cors({
    origin: GATEWAY_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
/**
 * Verify the JWT token and add the user to the request object
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const payload: IAuthPayload = verify(
      token,
      JWT_TOKEN_SECRET,
    ) as IAuthPayload;
    req.currentUser = payload;
  }
  next();
});

app.use(compression());
app.use(json({ limit: "200mb" }));
app.use(urlencoded({ extended: true, limit: "200mb" }));
app.use(enhancedResponse);

app.use(`${API_PREFIX}/health`, healthCheckRouter);

app.use(errorHandler);

const startServer = async () => {
  // First establish connection to RabbitMQ
  _channel = await createConnection();

  // First establish connection to Elasticsearch
  await checkConnection();

  // Initialize APM after Elasticsearch is connected
  initializeApm();

  app.listen(PORT, () => {
    log.info(`Auth Service (${API_VERSION}) is running on port ${PORT}.`);
  });
};

startServer().catch((error) => {
  log.error(`Failed to start ${SERVICE_NAME}:`, error);
  process.exit(1);
});
