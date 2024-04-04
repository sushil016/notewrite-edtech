const mongoose = require("mongoose");

exports.userSchema = new mongooseSchema({
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
    coures:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    }],
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userProfile",
        required:true
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress"
    }],
    accountType:{
        type:String,
        required:true,
        emum:['admin','student','teacher']
    }


})