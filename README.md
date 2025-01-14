# Fieldly

Fieldly is a web application designed to manage agricultural field data with role-based authentication for `User` and `Admin`. The app provides features to manage field data, subscriptions, and analytics for individual and aggregate lands.

## Features
- **Role-Based Authentication**: 
  - `Admin`: Manage all fields, users, subscriptions, and analytics.
  - `User`: Manage personal field data, view subscriptions, and analytics for owned fields.
- **Field Management**: Create, update, and delete field data.
- **Analytics**: View detailed and aggregate analytics for each field.
- **Subscriptions**: Manage subscriptions for using advanced features.
- **Secure and Scalable**: Implements secure routes with JWT-based authentication and follows CORS policies for cross-origin requests.

---

## Tech Stack
### Frontend:
- React
- Redux for State Management
- React Router for navigation

### Backend:
- Node.js with Express.js
- MongoDB (Database)
- JWT for Authentication
- dotenv for environment variables

---

## Prerequisites
Ensure the following tools are installed on your system:
1. Node.js (v16+ recommended)
2. MongoDB (local or cloud instance)
3. Git

---

## Installation and Setup
Follow these steps to run the application locally:

### 1. Clone the Repository
```bash
git clone <repository_url>
cd <repository_name>
```

### 2.  Backend Setup
Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

Create a .env file in the backend directory and add the following:
env

```bash
PORT=8080
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
FRONT_ENDS=http://localhost:5173
RAZORPAY_SECRET = razorpaysecret
RAZORPAY_KEY_ID = razorpayapikey
```

Start the server:
```bash
node app.js
```
The backend server will be available at http://localhost:8080.

### 3. Frontend Setup
Navigate to the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

Create a .env file in the frontend directory and add the following:
env

VITE_REACT_APP_BASE_URL=http://localhost:8080/api/v1
VITE_REACT_APP_MAPBOX_API_KEY=mapboxapikey
VITE_REACT_APP_BASE_URL: The base URL of the backend server.


Start the frontend:
```bash
npm run dev
```

The frontend app will be available at http://localhost:5173.

Running the Application
Ensure both backend and frontend servers are running.
Access the application at http://localhost:5173.

## API Endpoints
Authentication Routes  
POST /api/v1/auth/register: Register a new user.  
POST /api/v1/auth/login: User login.


Field Routes  
GET /api/v1/fields: Fetch all fields.  
POST /api/v1/fields: Create a new field.  
PUT /api/v1/fields/:id: Update a field by ID.  
DELETE /api/v1/fields/:id: Delete a field by ID.  

Analytics Routes  
GET /api/v1/analytics: Fetch analytics for all fields.
GET /api/v1/analytics/:id: Fetch analytics for a specific field.
GET /api/v1/analytics/:id/generate-analysis dummy AI endpoint to generate analysis
GET /api/v1/analytics/admin-analytics endpoint for fetching entire data for admin analysis.

Subscription Routes  
GET /api/v1/subscriptions/getAllSubscriptions: Fetch all subscriptions.
POST /api/v1/subscriptions/createOrder: Create a new subscription.
POST /api/v1/subscriptions/verify-payment: Create a new subscription.

   
Environment Variables  
Backend  
Key	Description  
PORT	Port for the backend server  
MONGO_URI	MongoDB connection string  
JWT_SECRET	Secret key for JWT authentication  
FRONT_ENDS	Allowed frontend origins for CORS  
RAZORPAY_SECRET Secret keys to implememt payment gateway
RAZORPAY_KEY_ID 

Frontend
Key	Description  
VITE_REACT_APP_BASE_URL	Base URL for the backend server  
VITE_REACT_APP_BASE_URL
VITE_REACT_APP_MAPBOX_API_KEY for mapbox to show the location of field
