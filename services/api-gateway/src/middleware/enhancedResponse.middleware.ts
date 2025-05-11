import { Request, Response, NextFunction } from "express";
import { log } from "@gateway/utils/logger.util";
import app from "../../package.json";

const enhancedResponse = (req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl } = req;

  // Start time to calculate response time
  const start = process.hrtime();

  // Capture the original `send` method
  const originalSend = res.send;

  // Override the `send` method to log the response
  res.send = function (body, ...rest): Response {
    // Calculate the response time
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e9 + diff[1]) / 1e6;

    // Add metadata to response body
    const enhancedBody = {
      service: `${app.name}`,
      appVersion: `v${app.version}`,
      method,
      status: res.statusCode,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime.toFixed(2)}ms`,
      url: originalUrl,
      data: typeof body === "string" ? JSON.parse(body) : body,
    };

    const logMessage = {
      loggerOrigin: "HTTP Logger",
      responseBody: enhancedBody,
    };

    // Log the response details - stringify the object to avoid Elasticsearch parsing errors
    log.info(JSON.stringify(logMessage));

    // Call the original `send` method to send the response
    return originalSend.apply(res, [JSON.stringify(enhancedBody), ...rest]);
  };

  next();
};

export default enhancedResponse;
