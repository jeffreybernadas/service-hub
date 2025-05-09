import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import {
  ELASTIC_SEARCH_URL,
} from "@notifications/constants/env.constants";
import { log } from "@notifications/utils/logger.util";

const elasticSearchClient = new Client({
  node: `${ELASTIC_SEARCH_URL}`,
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `Service Hub Notification Service Elasticsearch Health Status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      log.error("Connection to Elasticsearch failed. Retrying...");
      log.log(
        "error",
        "Service Hub Notification Service checkConnection() function:",
        error,
      );
    }
  }
}
