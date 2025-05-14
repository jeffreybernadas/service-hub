import "dotenv/config";
import express, {
  Application,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import {
  errorHandler,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "@jeffreybernadas/service-hub-helper";
import {
  CLIENT_URL,
  PORT,
  SERVICE_NAME,
} from "@gateway/constants/env.constants";
import { API_VERSION, API_PREFIX } from "@gateway/constants/version.constants";
import { log } from "@gateway/utils/logger.util";
import healthCheckRouter from "@gateway/routes/health.route";
import enhancedResponse from "@gateway/middleware/enhancedResponse.middleware";
import { checkConnection } from "@gateway/utils/elasticsearch.util";
import { initializeApm } from "@gateway/utils/apm.util";
import helmet from "helmet";
import cookieSession from "cookie-session";
import compression from "compression";
import { isAxiosError } from "axios";
const app = express();

const securityMiddleware = (app: Application) => {
  app.set("trust proxy", 1);
  app.use(
    cookieSession({
      name: "session",
      keys: [`${process.env.SECRET_KEY_ONE}`, `${process.env.SECRET_KEY_TWO}`],
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV !== "development",
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "none",
      }),
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.session?.jwt) {
      // TODO: Add JWT to the request headers
    }
    next();
  });
};

const standardMiddleware = (app: Application) => {
  app.use(compression());
  app.use(json({ limit: "200mb" }));
  app.use(urlencoded({ extended: true, limit: "200mb" }));
  app.use(enhancedResponse);
};

const routesMiddleware = (app: Application) => {
  app.use(`${API_PREFIX}/health`, healthCheckRouter);
};

const notFoundMiddleware = (app: Application) => {
  app.use("*", (req: Request, res: Response) => {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    log.error(`${fullUrl} endpoint does not exist.`);
    res
      .status(NOT_FOUND)
      .json({ message: "The endpoint called does not exist." });
  });
};

const errorMiddleware = (app: Application) => {
  // Handle Axios errors
  app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
    log.error(`Error caught by middleware: ${error.message}`);

    if (isAxiosError(error)) {
      const axiosError = error;
      log.error(`API Gateway Axios Error:`, {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        data: axiosError.response?.data
      });

      return res
        .status(axiosError.response?.status ?? INTERNAL_SERVER_ERROR)
        .json({
          message: axiosError.response?.data?.message ?? "External API error occurred.",
          error: process.env.NODE_ENV === "development" ? axiosError.message : undefined
        });
    }

    // Pass to next error handler if not an Axios error
    next(error);
  });

  // Finally, use the helper library's error handler for all other errors
  app.use(errorHandler);
};

const startServer = async () => {
  try {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    await checkConnection();
    initializeApm();
    errorMiddleware(app);
    notFoundMiddleware(app);
    
    app.listen(PORT, () => {
      log.info(`API Gateway (${API_VERSION}) is running on port ${PORT} - Health endpoint: http://localhost:${PORT}${API_PREFIX}/health`);
    });
  } catch (error) {
    log.error(`Error during server startup: ${error}`);
    process.exit(1);
  }
};

startServer().catch((error) => {
  log.error(`Failed to start ${SERVICE_NAME}:`, error);
  process.exit(1);
});
