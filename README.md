# Retail Hub Web

A full-stack e-commerce web application built with React, Node.js, Express, and MongoDB.

> **Disclaimer:** All product images and names used in this project are for educational and demonstration purposes only. All rights belong to their respective owners. This project is a student portfolio piece and is not intended for commercial use.

---

## Tech Stack

**Frontend**

- React 18 (Vite)
- React Router DOM
- Context API (Auth + Cart state)

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

---

## Features

### Customer

- User registration and login with JWT authentication
- Browse and search/filter products by name, description, stock status, and price
- Product detail page with quantity selector and image zoom
- Wishlist (add/remove products)
- Shopping cart with persistent state via localStorage
- Checkout with order summary and stock deduction on order placement
- Order history

### Admin

- Protected admin dashboard (role-based access)
- Full product CRUD — create, edit, and delete products

---

## Project Structure

```
retail-hub-web/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # JWT auth + admin guard
│   ├── models/         # Mongoose schemas (User, Product, Order)
│   ├── routes/         # Express route definitions
│   ├── index.js        # Entry point
│   └── seed.js         # Database seeder
└── frontend/
    └── src/
        ├── components/ui/   # Reusable UI components (Navbar, Button, Input, etc.)
        ├── contexts/        # React Context (AuthContext, CartContext)
        ├── features/        # Feature modules (auth, products, orders, account, admin)
        ├── pages/           # Top-level pages (Landing)
        └── services/        # API base URL config
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017

### Backend

```bash
cd backend
npm install
npm run dev
```

The server runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### Seed the Database

To populate the database with sample products:

```bash
cd backend
node seed.js
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/retail_hub_web
JWT_SECRET_KEY=your_jwt_secret_here
```

---

## API Endpoints

| Method | Endpoint                         | Description          | Auth   |
| ------ | -------------------------------- | -------------------- | ------ |
| GET    | `/api/products`                  | Fetch all products   | Public |
| GET    | `/api/products/:id`              | Fetch single product | Public |
| POST   | `/api/products`                  | Create product       | Admin  |
| PUT    | `/api/products/:id`              | Update product       | Admin  |
| DELETE | `/api/products/:id`              | Delete product       | Admin  |
| POST   | `/api/users/register`            | Register user        | Public |
| POST   | `/api/users/login`               | Login user           | Public |
| GET    | `/api/users/profile`             | Get profile          | User   |
| PUT    | `/api/users/profile`             | Update profile       | User   |
| DELETE | `/api/users/profile`             | Delete account       | User   |
| GET    | `/api/users/wishlist`            | Get wishlist         | User   |
| PUT    | `/api/users/wishlist/:productId` | Toggle wishlist item | User   |
| POST   | `/api/orders`                    | Place order          | User   |
| GET    | `/api/orders`                    | Get order history    | User   |
| GET    | `/api/orders/:id`                | Get order by ID      | User   |

---

## License

This project was created for academic purposes as a final project submission.
