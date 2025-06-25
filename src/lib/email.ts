const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY || '';

export async function sendVerificationEmail(email: string, name: string, verificationCode: string) {
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