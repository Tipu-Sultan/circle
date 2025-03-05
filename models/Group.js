import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    groupId: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, default: "group" },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    isPublic: { type: Boolean, default: false }, // Public or Private Group
    description: { type: String, trim: true },
    groupAvatar: { type: String, default: "" }, // URL for group avatar
  },
  { timestamps: true }
);

const Group = mongoose?.models?.Group || mongoose?.model("Group", GroupSchema);
export default Group;

