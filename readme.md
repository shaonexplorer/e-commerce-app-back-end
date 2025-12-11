# Assignment 08 - L2B5

---

## Description

The API is built with TypeScript, prisma and Express, designed to manage simple e commerce application. It provides endpoints for autentications and CRUD operations on products, orders and users management.

---

## Features

- CRUD operations for products, orders, users
- Data Validation with zod/react-hook-form
- Error Handling
- Image Uploading
- generating pdf invoice
- stripe as payment system

---

## Technologies Used

- **TypeScript**
- **Node.js**
- **Express.js**
- **Prisma/PostgreSQL**
- **Zod validation **

---

## Getting Started

Instructions on how to get the project up and running locally.

### Prerequisites

What you need to install before setting up the project.

- Node.js (LTS version recommended)
- npm or Yarn (package manager)
- Prisma

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/shaonexplorer/e-commerce-app-back-end.git
    cd your-api-project
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project and add the following:

```

    PORT=5000
# Database Connection URL
    DATABASE_URL=


 # Bcrypt Salt Rounds
    SALT_ROUNDS=10
# JWT Secret Key
    JWT_SECRET=
# Cloudinary Credentials
    CLOUD_NAME=
    API_KEY=
    API_SECRET=

# stripe
    STRIPE_SECRET=

# client

    CLIENT_URL=


# admin data
    ADMIN_EMAIL= "admin@gmail.com"
    ADMIN_PASSWORD= "123"
```

\_Make sure to replace placeholders like `your_database_connection_string` with your actual values.

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn run dev
    ```
    The API should now be running at `http://localhost:5000`

---

## API Endpoints

```

    | Method | Endpoint                                 | Description                          |
    | :----- | :-----------------------------------     | :------------------------------------|
    | POST   | /api/v1/users/register                   | Register user                        |
    | GET    | /api/v1/users                            | Get all users                        |
    | GET    | /api/v1/users/getMe                      | get me route                         |
    | POST   | /api/v1/users/:id                        | suspend user                         |
    | POST   | /api/v1/auth/login                       | login                                |
    | POST   | /api/v1/product/create                   | Create product                       |
    | PATCH  | /api/v1/product/:id                      |update product                        |
    | GET    | /api/v1/product?searchTerm=sample        | get all product                      |
    | GET    | /api/v1/product/:id                      | get single product                   |
    | DELETE | /api/v1/product/:id                      | delete product                       |
    | POST   | /api/v1/order                            | Create order                         |
    | GET    | /api/v1/order                            | get all orders                       |
    | POST   |/api/v1/payment/create-checkout-session   | initialize payment                   |
    | POST   |/api/v1/invoice/orderId                   | generate pdf invoice                 |




```
