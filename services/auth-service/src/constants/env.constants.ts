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
export const RABBITMQ_ENDPOINT = getEnv("RABBITMQ_ENDPOINT");
export const MYSQL_DB = getEnv("MYSQL_DB");
export const ELASTIC_SEARCH_URL = getEnv("ELASTIC_SEARCH_URL");
export const ELASTIC_APM_SERVER_URL = getEnv("ELASTIC_APM_SERVER_URL");
export const ELASTIC_APM_ENABLE = getEnv("ELASTIC_APM_ENABLE", "0");
export const ELASTIC_APM_SECRET_TOKEN = getEnv("ELASTIC_APM_SECRET_TOKEN");
export const JWT_TOKEN_SECRET = getEnv("JWT_TOKEN_SECRET");
export const GATEWAY_URL = getEnv("GATEWAY_URL");
export const CLOUDINARY_NAME = getEnv("CLOUDINARY_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
