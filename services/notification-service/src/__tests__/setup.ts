// Mock environment variables
process.env.SERVICE_NAME = 'notification-service-test';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.APP_ORIGIN = 'http://localhost:3000';
process.env.NODE_ENV = 'test';
process.env.RABBITMQ_ENDPOINT = 'amqp://localhost';
process.env.EMAIL_SENDER = 'test@example.com';
process.env.RESEND_API_KEY = 'test-api-key';
process.env.ELASTIC_SEARCH_URL = 'http://localhost:9200';
process.env.ELASTIC_APM_SERVER_URL = 'http://localhost:8200';
process.env.ELASTIC_APM_ENABLE = '0';
process.env.ELASTIC_APM_SECRET_TOKEN = 'test-token';

// Mock console.error to avoid polluting test output
const originalConsoleError = console.error;
console.error = jest.fn();

// Restore console.error after tests
afterAll(() => {
  console.error = originalConsoleError;
});
