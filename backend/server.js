import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// app config
const app = express();
const port = 5137;

// middlewares
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/userdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// API Routes

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Query MongoDB for all users
    res.status(200).json(users); // Return the users as a JSON response
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// POST a new user
app.post("/users", async (req, res) => {
    try {
      const newUser = new User(req.body); // Create a new user from the request body
      await newUser.save(); // Save the user to the database
      res.status(201).json({
        name: newUser.name,
        email: newUser.email,
        id: newUser._id, // You can also include the _id explicitly if you want
      }); // Return only the user data (excluding _id and __v)
    } catch (err) {
      res.status(500).send("Error creating user");
    }
  });

// PUT (update) a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated user
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updatedUser); // Return the updated user as a JSON response
  } catch (err) {
    res.status(500).send("Error updating user");
  }
});

// DELETE a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // Delete user by ID
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

// Test API Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
