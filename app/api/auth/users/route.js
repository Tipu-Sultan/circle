import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import AuthUser from "@/models/User";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// GET /api/auth/users
export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users except the current user
    const users = await AuthUser.find({ _id: { $ne: currentUserId } }).select('_id name email');

    // Map _id to id
    const formattedUsers = users.map((user) => ({
      id: user._id, 
      name: user.name,
      email: user.email,
    }));

    return NextResponse.json({ success: true, users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { id, name, type, currentUserId } = await req.json();

        if (!id || !name || !type || !currentUserId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find the current user
        const currentUser = await AuthUser.findById(currentUserId);
        if (!currentUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Check if the chat already exists
        const existingChat = currentUser.recentChats.find(
            (chat) => chat.chatId?.toString() === id
        );

        if (!existingChat) {
            // Add to recentChats
            currentUser.recentChats.push({ chatId: id, name, type });
            await currentUser.save();
        }

        return NextResponse.json(
            { message: "Recent chat updated", recentChats: currentUser.recentChats },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

