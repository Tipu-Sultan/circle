import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Ensure correct path
import Authuser from "@/models/User"; // Ensure correct path

export async function GET(req) {
    try {
        await dbConnect(); // Ensure DB connection

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Fetch only recentChats array
        const user = await Authuser.findById(userId)

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.recentChats, { status: 200 });

    } catch (error) {
        console.error("Error fetching recent chats:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
