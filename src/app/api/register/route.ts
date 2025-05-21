import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

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

    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        hashedPassword
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[REGISTER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 