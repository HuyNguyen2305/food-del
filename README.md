# food-del

## Setup Instructions

### 1. Install Dependencies for Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Install the required dependencies:
   ```bash
   npm install express mongoose cors nodemon


### 2. Install Dependencies for Frontend
1. Navigate to the frontend directory:

   ```bash
   cd frontend

2. Install Axios for HTTP requests:

   ```bash
   npm install axios

### 4. Set Up MongoDB
To set up MongoDB, follow these steps:

Download MongoDB:

Download MongoDB from the official MongoDB website.
Install MongoDB and MongoDB Compass.
Set Up MongoDB Compass:

Open MongoDB Compass and click on Add New Connection (the + sign next to CONNECTIONS).
Name the connection (e.g., "LocalMongo").
Click Create Database (the + sign next to your connection name).
Create a Database and Collection:

Create a database called crud.
Click on the + next to the crud database to create a new collection.
Create a collection called users.

### 5. Running the Application
1. After setting up the database and installing dependencies, you can run the backend using:

   ```bash
   npm start


2. Then open new terminal and run frontend using :
   ```bash
   npm run dev

Additional Notes
Ensure MongoDB is running before you start the application.
This setup assumes you have Node.js installed on your system. If not, you can download it from the official Node.js website.

