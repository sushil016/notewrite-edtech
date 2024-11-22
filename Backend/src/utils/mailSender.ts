import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables at startup
const validateConfig = () => {
    const required = ['EMAIL_USER', 'EMAIL_PASS', 'SMTP_FROM'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Log config (without sensitive data) for debugging
    console.log('Email Configuration:', {
        user: process.env.EMAIL_USER,
        from: process.env.SMTP_FROM,
        hasPassword: !!process.env.EMAIL_PASS
    });
};

interface MailData {
    email: string;
    subject: string;
    html?: string;
    text?: string;
}

// Create transporter with more detailed configuration
const createTransporter = () => {
    validateConfig();
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        debug: true,
        logger: true, // Enable built-in logger
        // Additional configuration for better reliability
        pool: true,
        maxConnections: 3,
        rateDelta: 20000,
        rateLimit: 5,
        secure: true  // Use TLS
    });
};

// Initialize transporter
const transporter = createTransporter();

export const sendMail = async (mailData: MailData) => {
    try {
        // Verify connection configuration
        console.log('Verifying transporter configuration...');
        await transporter.verify();
        console.log('Transporter verification successful');
        
        // Log email attempt (without sensitive data)
        console.log('Attempting to send email:', {
            to: mailData.email,
            subject: mailData.subject,
            hasHtml: !!mailData.html,
            hasText: !!mailData.text
        });
        
        const info = await transporter.sendMail({
            from: `"Notewrite" <${process.env.SMTP_FROM}>`,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
            text: mailData.text
        });
        
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response
        });
        
        return info;
    } catch (error: any) {
        // Enhanced error logging
        console.error('Detailed email error:', {
            error: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            stack: error.stack
        });
        
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Export for testing purposes
export const __test__ = {
    validateConfig,
    createTransporter
};