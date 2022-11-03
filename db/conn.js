const mongoose = require("mongoose");
const DB = 'mongodb+srv://palashb01:palashb01@cluster0.jhnswxg.mongodb.net/taskdata?retryWrites=true&w=majority';
mongoose.connect(DB).then(()=>{
    console.log("connection successful");
}).catch((err)=>console.error(err));