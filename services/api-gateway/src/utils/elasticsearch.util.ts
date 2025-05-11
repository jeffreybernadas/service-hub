import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { ELASTIC_SEARCH_URL } from "@gateway/constants/env.constants";
import { log } from "@gateway/utils/logger.util";

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
        `Service Hub API Gateway Elasticsearch Health Status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      log.error("Connection to Elasticsearch failed. Retrying...");
      log.log(
        "error",
        "Service Hub API Gateway checkConnection() function:",
        error,
      );
    }
  }
}
