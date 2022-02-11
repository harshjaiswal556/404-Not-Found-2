const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://harshjais3110:hs%203110@cluster0.tq9cf.mongodb.net/onlineBid?retryWrites=true&w=majority",{useNewUrlParser:true},{useUnifiedTopology:true}).then(()=>console.log("Connection successfull")).catch((err)=>{console.log(err)});