const brevo = require('@getbrevo/brevo');

export async function sendVerificationEmail(email: string, name: string, verificationCode: string) {
  let apiInstance = new brevo.TransactionalEmailsApi();
  
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
  
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Verify your email address";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .code { background-color: #e3f2fd; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; border-radius: 5px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Dashtly!</h1>
            </div>
            <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thank you for signing up! To complete your registration, please verify your email address by entering the verification code below:</p>
                
                <div class="code">${verificationCode}</div>
                
                <p>This verification code will expire in 15 minutes for security reasons.</p>
                <p>If you didn't create an account with us, you can safely ignore this email.</p>
                
                <p>Best regards,<br>The Dashtly Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  sendSmtpEmail.sender = { 
    name: "Dashtly", 
    email: process.env.BREVO_FROM_EMAIL || "noreply@dashtly.com" 
  };
  
  sendSmtpEmail.to = [{ email: email, name: name }];

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getVerificationCodeExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15); // 15 minutes from now
  return expiry;
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  let apiInstance = new brevo.TransactionalEmailsApi();
  
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
  
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Reset your password";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hi ${name},</h2>
                <p>We received a request to reset your password for your Dashtly account. If you made this request, click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <p><strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.</p>
                </div>
                
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">${resetUrl}</p>
                
                <p>Best regards,<br>The Dashtly Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  sendSmtpEmail.sender = { 
    name: "Dashtly", 
    email: process.env.BREVO_FROM_EMAIL || "noreply@dashtly.com" 
  };
  
  sendSmtpEmail.to = [{ email: email, name: name }];

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Password reset email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export function generatePasswordResetToken(): string {
  // Generate a secure random token
  return require('crypto').randomBytes(32).toString('hex');
}

export function getPasswordResetExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1); // 1 hour from now
  return expiry;
} 