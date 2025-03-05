import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Follow from "@/models/Follow";

export async function POST(req) {
    try {
      await dbConnect();
      const { followerId, followingId } = await req.json();
  
      if (!followerId || !followingId) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }
  
      // 🔹 Check for follow request in either direction
      let followRequest = await Follow.findOne({
        $or: [
          { follower: followerId, following: followingId },
          { follower: followingId, following: followerId }, // Reverse check
        ],
      });
  
      if (!followRequest) {
        // 🆕 Create a new follow request if no existing relationship
        followRequest = new Follow({
          follower: followerId,
          following: followingId,
          status: "pending",
        });
        await followRequest.save();
      } else if (followRequest.status === "pending") {
        // ✅ Accept the pending follow request
        followRequest.status = "accepted";
        await followRequest.save();
      } else {
        return NextResponse.json(
          { message: "Already following this user" },
          { status: 400 }
        );
      }
  
      return NextResponse.json(
        { message: "Follow request processed", followRequest },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const followerId = searchParams.get("followerId");
    const followingId = searchParams.get("followingId");

    if (!followerId || !followingId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const followRequest = await Follow.findOne({
      $or: [
        { follower: followerId, following: followingId },
        { follower: followingId, following: followerId },
      ],
    });

    return NextResponse.json({ status: followRequest?.status || "none" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { followerId, followingId } = await req.json();

    const followRequest = await Follow.findOneAndUpdate(
      { follower: followerId, following: followingId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!followRequest) {
      return NextResponse.json(
        { message: "No pending request found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Follow request accepted", followRequest },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { followerId, followingId } = await req.json();

    await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });


    return NextResponse.json(
      { message: "Unfollowed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
