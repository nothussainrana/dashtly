# Email Verification Setup Guide

This guide explains how to set up email verification functionality using Brevo SMTP for your Dashtly application.

## Overview

The email verification system has been implemented with the following features:

- **Registration Flow**: Users receive a 6-digit verification code via email after registration
- **Email Verification**: Users must enter the verification code to activate their account
- **Login Protection**: Users cannot sign in until their email is verified
- **Code Resending**: Users can request a new verification code if needed
- **Code Expiry**: Verification codes expire after 15 minutes for security

## Required Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Brevo SMTP Configuration
BREVO_API_KEY="your-brevo-api-key-here"
BREVO_FROM_EMAIL="noreply@yourdomain.com"
```

## Getting Your Brevo API Key

1. **Sign up for Brevo** (formerly Sendinblue):
   - Go to [https://www.brevo.com/](https://www.brevo.com/)
   - Create a free account

2. **Get your API Key**:
   - Log into your Brevo dashboard
   - Go to **Account** → **SMTP & API** → **API Keys**
   - Create a new API key or copy an existing one
   - The key should look like: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx`

3. **Set up your sender email**:
   - In Brevo, go to **Account** → **Senders & IP**
   - Add and verify your domain/email address
   - Use this verified email as your `BREVO_FROM_EMAIL`

## Database Migration

Run the database migration to add the required fields:

```bash
npx prisma migrate dev --name add_email_verification_fields
npx prisma generate
```

## Testing the Implementation

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the registration flow**:
   - Go to `/register`
   - Fill out the registration form
   - You should be redirected to `/verify-email` page
   - Check your email for the 6-digit verification code

3. **Test email verification**:
   - Enter the verification code on the verification page
   - You should see a success message and be redirected to login

4. **Test login protection**:
   - Try logging in with an unverified account
   - You should see an error message with a link to verify your email

## Files Modified/Created

### New Files Created:
- `src/lib/email.ts` - Email service using Brevo API
- `src/app/verify-email/page.tsx` - Email verification page
- `src/app/api/verify-email/route.ts` - API endpoint for verifying codes
- `src/app/api/resend-verification/route.ts` - API endpoint for resending codes

### Files Modified:
- `prisma/schema.prisma` - Added email verification fields to User model
- `src/lib/auth.ts` - Added email verification check to login
- `src/app/api/register/route.ts` - Updated to send verification emails
- `src/app/register/components/RegisterForm.tsx` - Updated registration flow
- `src/app/login/components/LoginForm.tsx` - Added verification error handling
- `package.json` - Added `@getbrevo/brevo` dependency

## Customization

### Email Template
You can customize the email template in `src/lib/email.ts` by modifying the `htmlContent` in the `sendVerificationEmail` function.

### Code Expiry Time
The verification code expires after 15 minutes by default. You can change this in the `getVerificationCodeExpiry` function in `src/lib/email.ts`.

### Code Length
The verification code is 6 digits by default. You can modify this in the `generateVerificationCode` function.

## Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check your Brevo API key is correct
   - Ensure your sender email is verified in Brevo
   - Check the console for error messages

2. **Verification code not working**:
   - Make sure the code hasn't expired (15 minutes)
   - Check for typos in the code entry
   - Try requesting a new code

3. **Database errors**:
   - Make sure you've run the Prisma migration
   - Check that your database is running
   - Regenerate the Prisma client if needed

### Support

For issues with Brevo SMTP, check their documentation at [https://developers.brevo.com/](https://developers.brevo.com/)

## Security Considerations

- Verification codes expire after 15 minutes
- Each user can only have one active verification code at a time
- Failed verification attempts are logged
- Users cannot access protected routes until email is verified
- Verification codes are 6 digits (1 in 1,000,000 chance of guessing)

## Next Steps

After setting up email verification, you might want to consider:

1. **Password Reset**: Implement password reset via email
2. **Email Preferences**: Allow users to manage email notifications
3. **Two-Factor Authentication**: Add SMS or authenticator app 2FA
4. **Email Templates**: Create more sophisticated email designs
5. **Analytics**: Track email open rates and verification conversion 