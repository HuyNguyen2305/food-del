import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'


//app config
const app = express()
const port = 5137

//middlewares
app.use(express.json())
app.use(cors())

//db connection
connectDB();


//api endpoints
app.use("/api/user", userRouter)


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})