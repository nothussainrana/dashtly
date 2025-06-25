import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, verificationCode } = body;

    if (!email || !verificationCode) {
      return new NextResponse("Missing email or verification code", { status: 400 });
    }

    // Find user with the email and verification code
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

    // Check if verification code matches
    if (user.emailVerificationCode !== verificationCode) {
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    // Check if verification code has expired
    if (!user.emailVerificationExpiry || new Date() > user.emailVerificationExpiry) {
      return new NextResponse("Verification code has expired", { status: 400 });
    }

    // Update user as verified and clear verification fields
    const verifiedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: new Date(),
        emailVerificationCode: null,
        emailVerificationExpiry: null
      }
    });

    return NextResponse.json({ 
      message: "Email verified successfully! You can now sign in.",
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.name,
        username: verifiedUser.username
      }
    });
  } catch (error) {
    console.log("[VERIFY_EMAIL_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 