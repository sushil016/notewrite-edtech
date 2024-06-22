const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = ()=> {
         mongoose.connect(process.env.DATABASE_URL)

         .then(()=>{
            console.log("Database Connect ho gya ");
         })
         .catch((err)=>{
            console.error(`Error in connecting to database ${err}`) 
         })

}