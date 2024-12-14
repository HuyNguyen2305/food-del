import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import UserModel from './models/User.js'

const app = express()
app.use(cors({ origin: "*" }));

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/crud")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Failed to connect to MongoDB:", err));

app.post("/LoginPopup", (req, res) => {
  console.log("POST /LoginPopup received", req.body);
  UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.status(400).json({ error: err.message }));
});
  

app.listen(3001,() => {
    console.log("Server is running")
})