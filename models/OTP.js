const mongoose = require("mongoose");
const mailSender = require("../utils/nodeMailer")

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }

})



async function sendVerificationmail (email,otp){
    try {
        const mailResponse = await mailSender(email,"verification mail from NoteWrite",otp)
        console.log("mail sent successfully", mailResponse)

    } catch (error) {
        console.log("error while sending mail", error)
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationmail(this.email, this.otp);
    next();
})


module.exports = mongoose.model("OTP",  OTPSchema);