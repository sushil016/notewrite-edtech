import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true // Enable debug logs
});

interface MailData {
    email: string;
    subject: string;
    html?: string;
    text?: string;
}

export const sendMail = async (mailData: MailData) => {
    try {
        // Verify connection configuration
        await transporter.verify();
        
        const info = await transporter.sendMail({
            from: `"Notewrite" <${process.env.SMTP_FROM}>`,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
            text: mailData.text
        });
        
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}; 