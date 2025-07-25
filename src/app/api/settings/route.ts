import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateVerificationCode, getVerificationCodeExpiry, sendVerificationEmail } from "@/lib/email";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { type, currentPassword, newValue, additionalData } = body;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    switch (type) {
      case 'name':
        if (!newValue || newValue.trim().length === 0) {
          return new NextResponse("Name cannot be empty", { status: 400 });
        }

        await prisma.user.update({
          where: { id: session.user.id },
          data: { name: newValue.trim() }
        });

        return NextResponse.json({ 
          message: "Name updated successfully",
          newValue: newValue.trim()
        });

      case 'username':
        if (!newValue || newValue.trim().length === 0) {
          return new NextResponse("Username cannot be empty", { status: 400 });
        }

        // Validate username format
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(newValue)) {
          return new NextResponse("Username can only contain letters, numbers, and underscores", { status: 400 });
        }

        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
          where: { username: newValue }
        });

        if (existingUser && existingUser.id !== session.user.id) {
          return new NextResponse("Username is already taken", { status: 400 });
        }

        await prisma.user.update({
          where: { id: session.user.id },
          data: { username: newValue }
        });

        return NextResponse.json({ 
          message: "Username updated successfully",
          newValue: newValue
        });

      case 'password':
        if (!currentPassword || !newValue) {
          return new NextResponse("Current password and new password are required", { status: 400 });
        }

        // Verify current password
        if (!currentUser.hashedPassword) {
          return new NextResponse("No password set for this account", { status: 400 });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.hashedPassword);
        if (!isCurrentPasswordValid) {
          return new NextResponse("Current password is incorrect", { status: 400 });
        }

        // Validate new password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(newValue)) {
          return new NextResponse("Password must be at least 6 characters and include a number, a lowercase letter, and an uppercase letter", { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newValue, 12);

        await prisma.user.update({
          where: { id: session.user.id },
          data: { hashedPassword: hashedNewPassword }
        });

        return NextResponse.json({ 
          message: "Password updated successfully"
        });

      case 'email':
        if (!newValue) {
          return new NextResponse("New email is required", { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
          return new NextResponse("Invalid email format", { status: 400 });
        }

        // Check if email is already taken
        const existingEmailUser = await prisma.user.findUnique({
          where: { email: newValue }
        });

        if (existingEmailUser && existingEmailUser.id !== session.user.id) {
          return new NextResponse("Email is already in use", { status: 400 });
        }

        // If current password is provided, verify it
        if (currentPassword && currentUser.hashedPassword) {
          const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.hashedPassword);
          if (!isPasswordValid) {
            return new NextResponse("Current password is incorrect", { status: 400 });
          }
        }

        // Generate verification code for new email
        const verificationCode = generateVerificationCode();
        const verificationExpiry = getVerificationCodeExpiry();

        // Update user with new email but mark as unverified
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            email: newValue,
            emailVerified: null, // Mark as unverified
            emailVerificationCode: verificationCode,
            emailVerificationExpiry: verificationExpiry
          }
        });

        // Send verification email to new address
        try {
          await sendVerificationEmail(newValue, currentUser.name || 'User', verificationCode);
        } catch (emailError) {
          console.error("[EMAIL_ERROR]", emailError);
          return new NextResponse("Email updated but verification email failed. Please request a new verification email.", { status: 500 });
        }

        return NextResponse.json({ 
          message: "Email updated successfully. Please check your new email address for verification.",
          requiresVerification: true
        });

      default:
        return new NextResponse("Invalid update type", { status: 400 });
    }
  } catch (error) {
    console.error("[SETTINGS_UPDATE_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 