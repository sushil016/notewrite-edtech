const mongoose =require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
    },
    courseDescriptin:{
        type:String,
    },
    couresTeacher:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    whatYouWillLearn:{
        type:String
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"section"
        }
    ],

    tag:{
        type: [String],
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    studentEnrolled:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
        }
    ],
    instruction:{
        type:[String]
    },
    status:{
        type:String,
        enum :["Draft" , "Published"]
    }
});





module.exports = mongoose.model("course", courseSchema)

