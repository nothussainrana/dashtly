import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail, generateVerificationCode, getVerificationCodeExpiry } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, username, password } = body;

    if (!email || !name || !username || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return new NextResponse("Username can only contain letters, numbers, and underscores", { status: 400 });
    }

    // Password complexity: at least 6 chars, one number, one lowercase, one uppercase
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return new NextResponse("Password must be at least 6 characters and include a number, a lowercase letter, and an uppercase letter", { status: 400 });
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingEmail) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    // Check for existing username
    const existingUsername = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (existingUsername) {
      return new NextResponse("Username already taken", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    const verificationExpiry = getVerificationCodeExpiry();

    // Create user with verification code (emailVerified is null until verified)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        hashedPassword,
        emailVerificationCode: verificationCode,
        emailVerificationExpiry: verificationExpiry,
        emailVerified: null // User is not verified yet
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationCode);
    } catch (emailError) {
      // If email fails, delete the user to prevent partial registration
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.error("[EMAIL_ERROR]", emailError);
      return new NextResponse("Failed to send verification email. Please try again.", { status: 500 });
    }

    return NextResponse.json({ 
      message: "Registration successful. Please check your email for verification code.",
      userId: user.id 
    });
  } catch (error) {
    console.log("[REGISTER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 