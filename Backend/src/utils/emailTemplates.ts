export const courseEnrollmentTemplate = (courseName: string, userName: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Course Enrollment Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Congratulations! You have successfully enrolled in the course: <strong>${courseName}</strong></p>
        <p>You can now access your course materials through your dashboard.</p>
        <div style="margin: 20px 0;">
            <p>What's next?</p>
            <ul>
                <li>Access your course dashboard</li>
                <li>Review the course curriculum</li>
                <li>Start your learning journey</li>
            </ul>
        </div>
        <p>Happy Learning!</p>
        <p>Best regards,<br>StudyNotion Team</p>
    </div>
    `;
};

export const passwordResetTemplate = (resetLink: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Reset Password
            </a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>StudyNotion Team</p>
    </div>
    `;
};

export const otpVerificationTemplate = (otp: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333;">Email Verification</h2>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Here is your OTP for email verification:
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff;">
                    ${otp}
                </span>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This OTP will expire in 5 minutes.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="font-size: 14px; color: #999;">
                    If you didn't request this verification, please ignore this email.
                </p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
            <p style="font-size: 14px;">
                Need help? Contact our support team
            </p>
        </div>
    </div>
    `;
}; 