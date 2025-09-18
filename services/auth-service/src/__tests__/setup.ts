// Mock environment variables
process.env.SERVICE_NAME = "auth-service-test";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.APP_ORIGIN = "http://localhost:3101";
process.env.NODE_ENV = "test";
process.env.RABBITMQ_ENDPOINT = "amqp://localhost";
process.env.ELASTIC_SEARCH_URL = "http://localhost:9200";
process.env.ELASTIC_APM_SERVER_URL = "http://localhost:8200";
process.env.ELASTIC_APM_ENABLE = "0";
process.env.ELASTIC_APM_SECRET_TOKEN = "test-token";

// Required for modules that import env.constants at module load time
process.env.MYSQL_DB = "mysql://root:password@localhost:3306/test_db";
process.env.JWT_TOKEN_SECRET = "test-secret";
process.env.GATEWAY_JWT_TOKEN_SECRET = "test-gateway-secret";

process.env.GATEWAY_URL = "http://localhost:3001";

process.env.CLOUDINARY_NAME = "test-cloudinary";
process.env.CLOUDINARY_API_KEY = "test-api-key";
process.env.CLOUDINARY_API_SECRET = "test-api-secret";
// Mock console.error to avoid polluting test output
const originalConsoleError = console.error;
console.error = jest.fn();

// Restore console.error after tests
afterAll(() => {
  console.error = originalConsoleError;
});
