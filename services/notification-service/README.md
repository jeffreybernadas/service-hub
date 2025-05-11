# 📧 Notification Service

A microservice responsible for handling all notification-related functionality in the Service Hub platform. This service manages email notifications for authentication, orders, and general system communications.

[![Health Check](https://img.shields.io/badge/Health_Check-URL-green?style=for-the-badge)](https://sh-notif.thecodebit.digital/api/v1/health)

## 📋 Overview

The Notification Service is a critical component of the Service Hub platform, responsible for sending various types of email notifications to users. It integrates with RabbitMQ for message queuing and uses the Resend API for email delivery. The service supports multiple email templates for different scenarios, including authentication flows, order management, and general notifications.

## ✨ Key Features

- **Email Notification System**: Sends transactional emails for various system events
- **Template-based Emails**: Supports multiple HTML email templates with dynamic content
- **Message Queue Integration**: Consumes messages from RabbitMQ queues for reliable notification delivery
- **Observability**: Integrated with Elasticsearch and Elastic APM for logging and monitoring
- **Health Checks**: Provides API endpoint for service health monitoring

## 🏗️ Architecture

### Components

- **Express Server**: Handles HTTP requests and provides health check endpoints
- **RabbitMQ Consumers**: Process messages from authentication and order queues
- **Email Template System**: Manages HTML templates with dynamic content replacement
- **Logging System**: Centralized logging with Winston and Elasticsearch
- **APM Integration**: Performance monitoring with Elastic APM

### RabbitMQ Integration

The service connects to RabbitMQ and sets up the following exchanges and queues:

- **Authentication Emails**:
  - Exchange: `service-hub-auth-notification`
  - Queue: `auth-email-queue`
  - Routing Key: `auth-email`

- **Order Emails**:
  - Exchange: `service-hub-order-notification`
  - Queue: `order-email-queue`
  - Routing Key: `order-email`

### Email Templates

The service supports the following email templates:

- **Authentication**:
  - Email Verification
  - Password Reset
  - Password Reset Success
  - OTP Verification

- **Orders**:
  - Order Placed
  - Order Receipt
  - Order Delivered
  - Order Extension
  - Order Extension Approval
  - Custom Offer

- **General**:
  - Generic Email Template

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check endpoint to verify service status |

## ⚙️ Configuration

The service uses environment variables for configuration. Create a `.env` file based on the `.env.example` template:

```
PORT=3102
APP_ORIGIN=http://localhost:3000
NODE_ENV=development
SERVICE_NAME=notification-service

# Elasticsearch Configuration
ELASTIC_SEARCH_URL=http://localhost:9200

# APM Configuration
ELASTIC_APM_ENABLE=1
ELASTIC_APM_SERVER_URL=http://localhost:8200
ELASTIC_APM_SECRET_TOKEN=your_secret_token

# Messaging
RABBITMQ_ENDPOINT=amqp://localhost:5672

# Email
EMAIL_SENDER=your-email@example.com
RESEND_API_KEY=your_resend_api_key

# Private Package
NPM_TOKEN=your_github_npm_token
```

## 🚀 Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- RabbitMQ server
- Elasticsearch (optional, for logging)
- Elastic APM server (optional, for monitoring)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/jeffreybernadas/service-hub.git
   cd service-hub/services/notification-service
   ```

2. Create a `.npmrc` file based on the `.npmrc.example` template:
   ```
   @jeffreybernadas:registry=https://npm.pkg.github.com/jeffreybernadas
   //npm.pkg.github.com/:_authToken=<NPM_TOKEN>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on the `.env.example` template and configure the environment variables.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the service using Docker Compose:
   ```bash
   docker-compose up -d notification-service
   ```

## 📦 Building for Production

1. Build the service:
   ```bash
   npm run build
   ```

2. The compiled output will be in the `dist` directory.

3. Start the production server:
   ```bash
   npm start
   ```

## 🧪 Testing

The service includes unit and integration tests using Jest.

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🔍 Linting

To run linting for this service:

```bash
npm run lint
```

## 📄 Formatting

To run formatting for this service:

```bash
npm run format
```

## 📨 Usage Examples

### Sending Authentication Emails

To send an authentication email, publish a message to the RabbitMQ exchange:

```javascript
// Example message for email verification
const message = {
  template: "verify-email",
  receiverEmail: "user@example.com",
  verifyLink: "https://service-hub.com/verify?token=xyz",
};

// Publish to RabbitMQ
channel.publish(
  "service-hub-auth-notification",
  "auth-email",
  Buffer.from(JSON.stringify(message))
);
```

### Sending Order Emails

To send an order-related email, publish a message to the RabbitMQ exchange:

```javascript
// Example message for order placed notification
const message = {
  template: "order-placed",
  receiverEmail: "contractor@example.com",
  customerUsername: "customer123",
  orderId: "ORD-12345",
  orderTitle: "Website Development",
  orderDescription: "Create a responsive website",
  orderAmount: "500",
  orderDue: "2023-12-31",
  orderUrl: "https://service-hub.com/orders/ORD-12345",
};

// Publish to RabbitMQ
channel.publish(
  "service-hub-order-notification",
  "order-email",
  Buffer.from(JSON.stringify(message))
);
```

## 📚 Dependencies

### Core
- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **TypeScript**: Type-safe programming language

### Messaging
- **amqplib**: RabbitMQ client for message queue integration

### Email
- **Resend**: Email delivery service for sending notifications

### Observability
- **Winston**: Logging library
- **Elasticsearch**: Distributed search and analytics engine
- **Elastic APM**: Application performance monitoring

### Development & Testing
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🔧 Helper Library

This service uses the private helper library `@jeffreybernadas/service-hub-helper` for common utilities and functions. The helper library can be found [here](https://github.com/jeffreybernadas/service-hub-helper).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
