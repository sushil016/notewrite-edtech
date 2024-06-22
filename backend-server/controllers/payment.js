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