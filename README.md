# README.md

# Food Ordering & Delivery System

A cloud-native food ordering and delivery platform built using microservices architecture with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Overview

This project implements a food delivery system similar to PickMe Food and UberEats, allowing customers to order food from multiple restaurants and get it delivered efficiently. The system follows a microservices architecture and utilizes Docker and Kubernetes for containerization and orchestration.

## Architecture

The system is composed of the following microservices:

1. **User Service**: Handles user authentication, authorization, and profile management
2. **Restaurant Service**: Manages restaurant information, menus, and availability
3. **Order Service**: Processes customer orders and tracks order status
4. **Delivery Service**: Assigns delivery personnel and tracks deliveries
5. **Payment Service**: Integrates with payment gateways to process transactions
6. **Notification Service**: Sends SMS and email notifications to users
7. **API Gateway**: Central entry point that routes requests to appropriate services

## Features

- User authentication and role-based access control (Customer, Restaurant, Delivery)
- Restaurant browsing and menu exploration
- Shopping cart and checkout functionality
- Real-time order tracking
- Secure payment integration (PayHere, Stripe, etc.)
- SMS and email notifications
- Delivery tracking with location updates

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- REST API

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling

### DevOps & Infrastructure
- Docker for containerization
- Kubernetes for orchestration
- GitHub for version control

## Getting Started

Follow the instructions in [SETUP.md](./SETUP.md) to get the project up and running.

## Project Structure

```
food-delivery-system/
├── docker-compose.yml
├── k8s/                      # Kubernetes configuration files
├── client/                   # React frontend application
├── services/
│   ├── api-gateway/          # API Gateway service
│   ├── user-service/         # User authentication & management
│   ├── restaurant-service/   # Restaurant & menu management
│   ├── order-service/        # Order processing
│   ├── delivery-service/     # Delivery management
│   ├── payment-service/      # Payment processing
│   └── notification-service/ # SMS & email notifications
└── README.md
```

## Contributors

- Samishka H T - IT22014290
- Pandithasundara N B - IT22248244
- Wijerathne C G T N - IT22333148

## License

This project is licensed under the MIT License.

---

# readme.txt

# Food Ordering & Delivery System - Deployment Guide

This document outlines the steps required to deploy the food delivery microservices application.

## Prerequisites

- Docker and Docker Compose installed
- Kubernetes cluster (for production deployment)
- Node.js v16+ and npm
- MongoDB (if running without Docker)

## Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/food-delivery-system.git
   cd food-delivery-system
   ```

2. Create `.env` file in the root directory with the following variables:
   ```
   MONGO_USERNAME=admin
   MONGO_PASSWORD=password
   JWT_SECRET=your-secret-key
   PAYHERE_API_URL=https://sandbox.payhere.lk/pay/checkout
   PAYHERE_MERCHANT_ID=your-merchant-id
   PAYHERE_MERCHANT_SECRET=your-merchant-secret
   STRIPE_SECRET_KEY=your-stripe-secret-key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   SMS_API_URL=https://api.example.com/sms
   SMS_API_KEY=your-sms-api-key
   SMS_SENDER_ID=FOODDEL
   ```

3. Start the services using Docker Compose:
   ```
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost
   - API Gateway: http://localhost:3000

## Individual Service Setup (for development)

### Backend Services

For each service in the `services` directory:

1. Navigate to the service directory:
   ```
   cd services/service-name
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file with appropriate environment variables (see docker-compose.yml for reference)

4. Start the service:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## Production Deployment with Kubernetes

1. Update the Kubernetes configuration files in the `k8s` directory with your specific settings.

2. Apply the MongoDB configuration:
   ```
   kubectl apply -f k8s/mongodb-secret.yaml
   kubectl apply -f k8s/mongodb-pvc.yaml
   kubectl apply -f k8s/mongodb-deployment.yaml
   ```

3. Apply the app secrets:
   ```
   kubectl apply -f k8s/app-secret.yaml
   ```

4. Deploy the microservices:
   ```
   kubectl apply -f k8s/user-service-deployment.yaml
   kubectl apply -f k8s/restaurant-service-deployment.yaml
   kubectl apply -f k8s/order-service-deployment.yaml
   kubectl apply -f k8s/delivery-service-deployment.yaml
   kubectl apply -f k8s/payment-service-deployment.yaml
   kubectl apply -f k8s/notification-service-deployment.yaml
   kubectl apply -f k8s/api-gateway-deployment.yaml
   ```

5. Deploy the client application:
   ```
   kubectl apply -f k8s/client-deployment.yaml
   ```

6. Apply the ingress configuration:
   ```
   kubectl apply -f k8s/ingress.yaml
   ```

7. Access the application through the configured domain or load balancer IP.

## Troubleshooting

- If services are not connecting, check that all environment variables are set correctly.
- For connection issues between services, ensure that service names match the environment variables.
- If you encounter database connection errors, verify that MongoDB is running and accessible.

For any other issues, please check the logs of the specific service:
```
docker logs container_name
```
or
```
kubectl logs pod_name
```

---

# members.txt

Team Members:
- Samishka H T - IT22014290
- Pandithasundara N B - IT22248244
- Wijerathne C G T N - IT22333148
