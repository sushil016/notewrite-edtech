const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (body , email ,title)=>{
   try {
       const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
               user:process.env.MAIL_USER,
               pass:process.env.MAIL_PASS
        }
       })

        const infoMail = await transporter.sendMail({
            from: "NoteWrite By Sushil",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(infoMail)

   } catch (error) {
     console.log("error while sending mail", error);
    
   }
}

module.exports = mailSender;