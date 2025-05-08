import "dotenv/config";
import express from "express";
import cors from "cors";
import healthCheckHandler from "@notifications/routes/health.route";
import { APP_ORIGIN, PORT } from "@notifications/constants/env.constants";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));

app.get("/health", healthCheckHandler);

app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}.`);
});
