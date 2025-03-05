import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import IsChatAlready from "@/utils/IsChatAlready";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect(); // Ensure database connection

    const { groupId, userId } = await req.json(); // Get groupId and userId from request body
    const arr = [];

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // Check if the user is already a member
    if (group.participants.includes(userId)) {
      return NextResponse.json({ message: "User is already in the group" }, { status: 400 });
    }

    // Add the user to the group's members array
    group.participants.push(userId);
    await group.save();

    // Call IsChatAlready function (make sure it accepts correct arguments)
    const result = await IsChatAlready(group._id, group.name, group.type, group.avatar, userId, arr);

    return NextResponse.json({ message: "User added to group successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error joining group", error: error.message },
      { status: 500 }
    );
  }
}
