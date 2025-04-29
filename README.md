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

# Food Delivery System Deployment Guide

This document provides step-by-step instructions for deploying the Food Delivery System.

## Prerequisites

- Docker and Docker Compose installed
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Environment variables configured

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGO_USERNAME=your_mongo_username
MONGO_PASSWORD=your_mongo_password

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Payment Gateway Configuration
PAYHERE_API_URL=your_payhere_api_url
PAYHERE_MERCHANT_ID=your_payhere_merchant_id
PAYHERE_MERCHANT_SECRET=your_payhere_merchant_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Configuration
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_SECURE=true/false
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

# SMS Configuration
SMS_API_URL=your_sms_api_url
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=your_sms_sender_id
```

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-delivery-system
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install service dependencies
cd ../services
for service in */; do
  cd "$service"
  npm install
  cd ..
done
```

### 3. Build Docker Images

```bash
# Build all services
docker-compose build
```

### 4. Start the Services

```bash
# Start all services
docker-compose up -d
```

The system will start the following services:
- MongoDB (port 27017)
- API Gateway (port 3000)
- User Service (port 3001)
- Restaurant Service (port 3002)
- Order Service (port 3003)
- Delivery Service (port 3004)
- Payment Service (port 3005)
- Notification Service (port 3006)

### 5. Verify Deployment

Check if all services are running:

```bash
docker-compose ps
```

### 6. Access the Application

- Frontend: http://localhost:3000
- API Gateway: http://localhost:3000/api
- Individual services can be accessed through their respective ports

## Stopping the Services

To stop all services:

```bash
docker-compose down
```

## Troubleshooting

1. If services fail to start:
   - Check Docker logs: `docker-compose logs <service-name>`
   - Verify environment variables are correctly set
   - Ensure MongoDB connection is working

2. If you encounter port conflicts:
   - Modify the port mappings in `docker-compose.yml`
   - Ensure no other services are using the required ports

3. For database issues:
   - Check MongoDB connection string
   - Verify database credentials
   - Ensure MongoDB service is running

## Additional Notes

- The system uses MongoDB Atlas for database storage
- All services are containerized using Docker
- The API Gateway handles routing between services
- Each service has its own database collection
- Payment integration supports both PayHere and Stripe
- Email and SMS notifications are configured through the notification service

## Support

For any deployment issues or questions, please contact the development team.

---

# members.txt

Team Members:
- Samishka H T - IT22014290
- Pandithasundara N B - IT22248244
- Wijerathne C G T N - IT22333148

---

# submission.txt

GitHub Repository: https://github.com/your-username/food-delivery-system

YouTube Video Demo: https://www.youtube.com/watch?v=your-video-id