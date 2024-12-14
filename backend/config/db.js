import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://huyworkandcontact:huynguyen2305@cluster0.bblpo.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}