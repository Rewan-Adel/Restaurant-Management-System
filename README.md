# Simplified Restaurant Management System

## Overview

This is a **Simplified Restaurant Management System API** that supports **menu management, order management, and user authentication**. The system is built using **Node.js** with the **Express.js** framework and uses **Sequelize** to interact with a relational database.

---

## Features

### 1. Menu Management

- Admins can:
  - Perform CRUD operations on menu items (name, description, price, category).
  - Filter menu items by category.
  - Sort menu items by price (ascending/descending).

### 2. Order Management

- **Restaurant staff** can:
  - Take orders.
  - Add/remove items from a pending order.
  - Mark orders as complete.
- **Admins** can:
  - View and manage all orders.
  - Check order details and statuses.
- Automatically mark orders as "expired" if they are still pending 4 hours after creation.

### 3. User Authentication

- Role-based access control for:
  - **Admins**.
  - **Restaurant staff**.
- Only authenticated users can access order functionalities.

---

## Technical Stack

- **Backend**: Node.js with Express.js framework.
- **Database**: MySQL with Sequelize ORM.
- **Testing**: Focused automated tests for critical endpoints.
- **API Documentation**: Interactive documentation using Postman and Swagger.

---
### Database Schema
![db](./images/diagram.png)

## Setup and Installation

### Prerequisites

1. Node.js (>= 14.x)
2. NPM 
3. MySQL database
4. Postman 

### Installation Steps

1. Clone the Repository:

   ```bash
   git clone https://github.com/Rewan-Adel/Restaurant-Management-System.git
   cd Restaurant-Management-System
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     NODE_ENV=development
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASS=your_db_password
     DB_NAME=restaurant_db
     TOKEN_SECRET=your_secret_key
     JWT_EXPIRATION=24h
     ```

4. Start the Server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

---

## API Documentation

The API is documented using **Swagger** or **Postman**. You can view the documentation interactively:

- **Swagger**: Visit `/api-docs` (if Swagger is implemented).
- **Postman**: Import the provided Postman collection from the repository.

### Sample Endpoints

#### Menu Management

1. **Create Menu Item** (Admins only):

   ```http
   POST /menu
   ```

   - Request Body:
     ```json
     {
       "name": "Pizza",
       "description": "Delicious cheese pizza",
       "price": 12.99,
       "category": "Main Course"
     }
     ```
   - Response:
     ```json
     {
       "success": true,
       "message": "Menu item created successfully",
       "data": { ... }
     }
     ```

2. **Get Menu Items**:

   ```http
   GET /menu?category=Main Course&sort=asc
   ```

   - Response:
     ```json
     [
       {
         "id": 1,
         "name": "Pizza",
         "description": "Delicious cheese pizza",
         "price": 12.99,
         "category": "Main Course"
       }
     ]
     ```

#### Order Management

1. **Create Order** (Staff only):

   ```http
   POST /orders
   ```

   - Request Body:
     ```json
     {
       "items": [
         { "itemID": 1, "quantity": 2 },
         { "itemID": 2, "quantity": 1 }
       ]
     }
     ```
   - Response:
     ```json
     {
       "success": true,
       "message": "Order created successfully",
       "data": { ... }
     }
     ```

2. **Update Order (Remove Items)**:

   ```http
   PUT /orders/:orderID/remove-items
   ```

   - Request Body:
     ```json
     {
       "items": [
         { "itemID": 1, "quantity": 1 }
       ]
     }
     ```

3. **Mark Order as Complete**:

   ```http
   PUT /orders/:orderID/complete
   ```

---

## Testing

Run automated tests:

```bash
npm test
```

### Critical API Endpoints Tested:

1. Menu filtering and sorting.
2. Order creation and item management.

---
### Deployment Link

- [API Live Demo](https://your-deployment-link.com)
