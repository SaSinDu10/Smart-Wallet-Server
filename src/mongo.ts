const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");
connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
})

const newSchema = new mongoose.Schema({
    usename:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = mongoose.model("collection",newSchema);

module.exports = collection