import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { ELASTIC_SEARCH_URL } from "@auth/constants/env.constants";
import { log } from "@auth/utils/logger.util";

const elasticSearchClient = new Client({
  node: `${ELASTIC_SEARCH_URL}`,
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  let retryCount = 0;
  const maxRetries = 10;
  const baseDelay = 1000; // 1 second

  while (!isConnected && retryCount < maxRetries) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `Service Hub Auth Service Elasticsearch Health Status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      retryCount++;
      const delay = baseDelay * Math.pow(2, retryCount - 1); // Exponential backoff

      if (retryCount >= maxRetries) {
        log.error(
          `Failed to connect to Elasticsearch after ${maxRetries} attempts`,
        );
        throw new Error("Elasticsearch connection timeout");
      }

      log.error(
        `Connection to Elasticsearch failed (attempt ${retryCount}/${maxRetries}). Retrying in ${delay}ms...`,
      );
      log.log(
        "error",
        "Service Hub Auth Service checkConnection() function:",
        error,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
