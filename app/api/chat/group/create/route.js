import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import IschatAlready from "@/utils/IsChatAlready";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect(); // Ensure database connection

    const { groupId, name,type, avatar, createdBy, admins, participants } = await req.json();

    if (!groupId || !name || !createdBy || !admins || !participants) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newGroup = new Group({ groupId, name, createdBy, admins, participants });
    await newGroup.save();

    const result = await IschatAlready(newGroup?._id, name, type, avatar, createdBy,participants);


    return NextResponse.json({ message: "Group created successfully", result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating group", error: error.message }, { status: 500 });
  }
}
