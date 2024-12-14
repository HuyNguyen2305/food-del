# food-del

## Setup Instructions

### 1. Install Dependencies for Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
Install the required dependencies:
bash
Copy code
npm install express mongoose cors nodemon
2. Install Dependencies for Frontend
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install Axios for HTTP requests:

bash
Copy code
npm install axios
3. Set Up MongoDB
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
4. Running the Application
After setting up the database and installing dependencies, you can run the backend using:

bash
Copy code
npm start
Make sure to run the frontend and backend in their respective directories.

Additional Notes
Ensure MongoDB is running before you start the application.
This setup assumes you have Node.js installed on your system. If not, you can download it from the official Node.js website.
csharp
Copy code
