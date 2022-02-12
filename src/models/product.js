const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    fullName : {
        type:String,
        required:true
    },
    productName : {
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

const product = new mongoose.model("product",productSchema);

module.exports = product;
