import mongoose from "mongoose";

const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");
connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
})

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

export const collection = mongoose.model("collection",userSchema);

