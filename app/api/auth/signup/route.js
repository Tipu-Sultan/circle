import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AuthUser from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect(); 

    const { name, email, password } = await req.json(); 

    // Check if user exists
    const existingUser = await AuthUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }


    // Create user
    const newUser = await AuthUser.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
