import "dotenv/config";
import express from "express";
import cors from "cors";
import healthCheckHandler from "@notifications/routes/health.route";
import { APP_ORIGIN, PORT } from "@notifications/constants/env.constants";
import { API_PREFIX, API_VERSION } from "@notifications/constants/version.constant";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));

app.get(`${API_PREFIX}/health`, healthCheckHandler);

app.listen(PORT, () => {
  console.log(`Notification Service (${API_VERSION}) is running on port ${PORT}.`);
});
