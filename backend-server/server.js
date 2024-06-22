const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.get('/', (req,res)=>{
    res.send("NOTE.WRITE BAN RAHA HAI")
})
app.listen(PORT , ()=>{
    console.log(`server ${PORT} chal Raha hai`)
})