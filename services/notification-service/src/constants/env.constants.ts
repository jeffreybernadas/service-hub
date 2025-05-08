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

export const PORT = getEnv("PORT", "3102");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const RABBITMQ_ENDPOINT = getEnv("RABBITMQ_ENDPOINT");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const ELASTIC_SEARCH_URL = getEnv("ELASTIC_SEARCH_URL");
