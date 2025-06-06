/**
 * Returns the value of a specified env variable key
 * @param {string} key The name of the env variable to retrieve
 * @param {string} defaultValue Default value (not the value from env variables)
 * @returns {string | undefined} Value of the env variables
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const PORT = getEnv("PORT", "3101");
export const CLIENT_URL = getEnv("CLIENT_URL", "http://localhost:3000");
export const SERVICE_NAME = getEnv("SERVICE_NAME");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const ELASTIC_SEARCH_URL = getEnv("ELASTIC_SEARCH_URL");
export const ELASTIC_APM_SERVER_URL = getEnv("ELASTIC_APM_SERVER_URL");
export const ELASTIC_APM_ENABLE = getEnv("ELASTIC_APM_ENABLE", "0");
export const ELASTIC_APM_SECRET_TOKEN = getEnv("ELASTIC_APM_SECRET_TOKEN");
export const SECRET_KEY_ONE = getEnv("SECRET_KEY_ONE");
export const SECRET_KEY_TWO = getEnv("SECRET_KEY_TWO");
export const GATEWAY_JWT_TOKEN_SECRET = getEnv("GATEWAY_JWT_TOKEN_SECRET");
export const JWT_TOKEN_SECRET = getEnv("JWT_TOKEN_SECRET");
export const AUTH_BASE_URL = getEnv("AUTH_BASE_URL");
export const USERS_BASE_URL = getEnv("USERS_BASE_URL");
export const SERVICES_BASE_URL = getEnv("SERVICES_BASE_URL");
export const ORDER_BASE_URL = getEnv("ORDER_BASE_URL");
export const REVIEW_BASE_URL = getEnv("REVIEW_BASE_URL");
export const CHAT_BASE_URL = getEnv("CHAT_BASE_URL");
export const REDIS_HOST = getEnv("REDIS_HOST");
