const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    FirstName:{
        type: String,
        Required: true,
        trim : true
    },
    LastName:{
        type: String,
        Required: true,
        trim:true
    },
    email:{
        type: String,
        Required: true
    },
    contactNumber:{
        type:Number,
        Required: true
    },
    password:{
        type: String,
        Required: true
    },
    confirmPassword:{
        type: String,
        Required: true
    },
    course:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    }],
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profile",
        required:true
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress"
    }],
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },

    image:{
        type: String
    },
    accountType:{
        type:String,
        required:true,
        emum:['admin','student','teacher']
    }

})


module.exports = mongoose.model("user", userSchema);

