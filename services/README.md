# 🚀 Service Hub Microservices

This directory contains all the microservices that power the Service Hub platform. Each service is designed to handle specific functionality within the application, following a microservice architecture pattern.

## 📋 Overview

Service Hub is built on a microservice architecture, where each service is responsible for a specific domain of functionality. This approach allows for:

- **Scalability**: Services can be scaled independently based on demand
- **Resilience**: Failure in one service doesn't bring down the entire system
- **Technology Flexibility**: Each service can use the most appropriate technology stack
- **Team Autonomy**: Different teams can work on different services independently
- **Deployment Independence**: Services can be deployed independently of each other

## 🏗️ Architecture

The Service Hub platform uses the following architectural patterns:

- **API Gateway**: Routes client requests to appropriate services
- **Message Queues**: Asynchronous communication between services using RabbitMQ
- **Distributed Logging**: Centralized logging with Elasticsearch
- **Monitoring**: Application performance monitoring with Elastic and Grafana
- **Containerization**: Docker for consistent deployment environments

## 🔌 Services

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| [API Gateway](./api-gateway) | 3100 | Routes client requests to appropriate services | In progress |
| [Auth Service](./auth-service) | 3101 | Manages authentication and authorization | TBD |
| [Notification Service](./notification-service) | 3102 | Handles email notifications and messaging | Deployed |
| [User Service](./user-service) | 3103 | Handles user profiles and management | TBD |
| [Service Listing](./service-listing) | 3104 | Manages service listings and categories | TBD |
| [Order Service](./order-service) | 3105 | Processes orders and payments | TBD |
| [Review Service](./review-service) | 3106 | Manages service reviews and ratings | TBD |
| [Chat Service](./chat-service) | 3107 | Handles real-time messaging between users | TBD |

## 🔄 Inter-Service Communication

Services communicate with each other through:

1. **REST APIs**: For synchronous request-response patterns
2. **Message Queues**: For asynchronous communication using RabbitMQ
3. **Event Sourcing**: For maintaining data consistency across services

## 🔧 Common Utilities

All services share common utilities and configurations:

- **Helper Library**: [`@jeffreybernadas/service-hub-helper`](https://github.com/jeffreybernadas/service-hub-helper) for shared functionality
- **Error Handling**: Standardized error handling across services
- **Logging**: Consistent logging format using Winston and Elasticsearch
- **Authentication**: JWT-based authentication
- **API Versioning**: All APIs are versioned (e.g., `/api/v1/...`)

## 🛠️ Technology Stack

### Core Technologies
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Jest**: Testing framework

### Databases
- **MySQL**: Relational database for structured data
- **PostgreSQL**: Advanced relational database
- **MongoDB**: NoSQL database for document storage
- **Redis**: In-memory data store for caching

### Messaging & Real-time
- **RabbitMQ**: Message broker for asynchronous communication
- **Socket.IO**: Real-time bidirectional event-based communication

### Observability
- **Elasticsearch**: Distributed search and analytics engine
- **Kibana**: Data visualization dashboard for Elasticsearch
- **Elastic APM**: Application performance monitoring
- **Winston**: Logging library and service-wide logging (via Elasticsearch)
- **Grafana**: Monitoring dashboard
- **Prometheus**: Monitoring system

### External Services
- **Resend**: Email delivery service
- **Stripe API**: Payment processing

## 🚀 Development Workflow

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/jeffreybernadas/service-hub.git
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the required infrastructure:
   ```bash
   docker-compose up -d redis mongodb mysql postgres rabbitmq elasticsearch kibana
   ```

4. Navigate to the service directory you want to work on:
   ```bash
   cd services/[service-name]
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Start the service in development mode:
   ```bash
   npm run dev
   ```

### Using Docker

To run all services using Docker:

```bash
docker-compose up -d
```

To run a specific service:

```bash
docker-compose up -d [service-name]
```

## 📦 Building for Production

Each service can be built for production using:

```bash
cd services/[service-name]
npm run build
```

## 🧪 Testing

Each service includes its own test suite. To run tests for a specific service:

```bash
cd services/[service-name]
npm run test
```

## 🔍 Linting

To run linting for a specific service:

```bash
cd services/[service-name]
npm run lint
```

## 📄 Formatting

To run formatting for a specific service:

```bash
cd services/[service-name]
npm run format
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
