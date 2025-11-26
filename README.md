# food-del

## Project Description

**food-del** is a full-stack food delivery management system designed for restaurants and delivery businesses. The project includes:

- **Admin Dashboard**: A React-based web interface for managing orders, viewing customer details, updating order statuses, and tracking delivery progress. Admins can view all incoming orders, update their status (e.g., Food Processing, Out for Delivery, Delivered), and see detailed customer and order information.

- **Backend API**: A Node.js/Express server with MongoDB integration. The backend handles user authentication, order creation, order status updates, and provides RESTful endpoints for both the admin dashboard and other clients. It supports secure authentication, order management, and real-time updates for order status.

- **Order Management**: Orders are stored in a MongoDB database, with each order containing customer details, delivery address, items, payment status, and current order status. The backend exposes endpoints for listing all orders, updating order status, and retrieving order details.

- **Technologies Used**:
  - React (Admin Dashboard)
  - Node.js & Express (Backend API)
  - MongoDB (Database)
  - Axios (API requests)
  - React Toastify (Notifications)
  - CSS Modules (Styling)

## Features

- View all orders in real time
- Update order status (Food Processing, Out for Delivery, Delivered)
- View customer and delivery address details
- Responsive and user-friendly admin interface
- RESTful API for order management
- Secure backend with authentication and validation

## How to Run

1. **Backend**
   - Install dependencies: `npm install`
   - Start server: `npm start`
   - The backend runs on `http://localhost:4000`

2. **Admin Dashboard**
   - Install dependencies: `npm install`
   - Start development server: `npm start`
   - The admin dashboard runs on `http://localhost:5174`

## Folder Structure

- `admin/` - React admin dashboard source code
- `backend/` - Node.js/Express backend API source code

---

**Note:** This description excludes the mobile shipper app.  
For mobile delivery/shipping features, see the corresponding mobileShipper documentation.
