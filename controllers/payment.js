const {instance} = require("../config/razorpay");
const course = require("../models/course");
const user = require("../models/user")
const mailSender = require("../utils/nodeMailer");
const {default : mongoose} = require("mongoose")


exports.capturePayment = async (req, res) => {
    const {course_id} = req.body;
    const userId = req.user.id;

    if (!course_id) {
        return res.status(500).json({
            message:error.mrssage
        })
    }


    let Course;

    try {
        const Course = await course.findbyId(course_id)

        if (!Course) {
            return res.json({
                message:"could not find course",
                status: error.message
            })
        }


        const uid = new mongoose.Types.ObjectId(userId)

        if (Course.studentEnrolled.include(uid)) {
            return res.status(200).json({
                success:false,
                message:"user already enrolled in this course"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"something went wrong while in finding course details relatied information",
            success:false
        })
    }


    // order crete

    const amount = Course.price;
    const Currency = "INR";

    const options = {
        amount:amount*100,
        Currency,
        notes:{
            courseId :course_id,
            userId
        }
    }

    try {
          const payment = await instance.createOrder(options);
          console.log(payment)

          return res.status(200).json({
            success:true,
            message:"order created successfully",
            courseName:Course.courseName,
            description: Course.description,
            orderId:payment.id,
            Currency:payment.Currency,
            amount: payment.amount
          })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:"something went wrong while creating order"
        })
    }
}


exports.verifySignature = async (req , res) =>{
    const webhookSecret = "123456666";

    const signature = req.headers["x-razorpay-siganture"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req));
    const digest = shasum.digest("hex");

    if (signature === digest) {
         console.log("payment is authorized");

         const {courseId , userId} = req.body.payload.payment.entity.notes;
         
         
         try {
            const enrolledCourse = await course.findOneAndUpdate({_id:courseId},
                                                                 {$push:{
                                                                    studentEnrolled:userId
                                                                 }},
                                                                 {new:true}
             );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    msg:"course not found"
                });
             }

            const enrolledStudent = await user.findOneAndUpdate({_id:userId},
                                                                {$push:{
                                                                    course:courseId
                                                                 }},
                                                                {new:true});

            console.log(enrolledStudent); 
            
            
            const EmailResponse = await mailSender(enrolledStudent.email,
                                                "conguralation for enrolling",
                                                "congrats")

            console.log(EmailResponse);
            return res.status(200).json({
                success:true,
                msg:"course added to your id"
            })                                    
         } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                msg:error.msg
            })
         }

    }else{
        return res.status(400).json({
            success:false,
            message:error.message,
            msg:"can't verify signature"  
        })
    }
}