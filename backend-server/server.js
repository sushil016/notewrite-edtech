const express = require("express");
const app = express();
require("dotenv").config();
const notewrite = require("./routes/Route")
const DatabaseNotewrite = require("./config/Database")
const fileupload = require("express-fileupload");
const cloudinary = require("./utils/imageUploader")
const {cloudinaryConnect} = require("./config/cloudinary")
const cookieparser = require("cookie-parser");
const cors = require("cors")

app.use(express.json());
app.use(cookieparser());
// app.use(cors({
//     origin:"https://localhost:3000"
// }))

const PORT = process.env.PORT || 8000;


app.use('/api/v2', notewrite)


app.use(fileupload());


DatabaseNotewrite.dbConnect();


cloudinaryConnect();






app.get('/', (req,res)=>{
    res.send("NOTE.WRITE BAN RAHA HAI")
})
app.listen(PORT , ()=>{
    console.log(`server ${PORT} chal Raha hai`)
})