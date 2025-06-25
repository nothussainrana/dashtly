import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail, generateVerificationCode, getVerificationCodeExpiry } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Find user with the email
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return new NextResponse("Email already verified", { status: 400 });
    }

    const verificationCode = generateVerificationCode();
    const verificationExpiry = getVerificationCodeExpiry();

    // Update user with new verification code
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerificationCode: verificationCode,
        emailVerificationExpiry: verificationExpiry
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, user.name || 'User', verificationCode);
    } catch (emailError) {
      console.error("[EMAIL_ERROR]", emailError);
      return new NextResponse("Failed to send verification email. Please try again.", { status: 500 });
    }

    return NextResponse.json({ 
      message: "Verification code resent successfully. Please check your email."
    });
  } catch (error) {
    console.log("[RESEND_VERIFICATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 