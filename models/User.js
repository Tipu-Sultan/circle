import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const recentChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recentChats.type", 
      default: null, // Can be null if not assigned
    },
    name: {
      type: String,
      default: "", // Optional: Can be an empty string
    },
    type: {
      type: String,
      enum: ["user", "group"],
      default: "user", // Default type
    },
    lastMessage: {
      type: String, // Last message content
      default: "",
    },
    avatar: {
      type: String, // Last message content
      default: "",
    },
    unreadCount: {
      type: Number,
      default: 0, // Unread messages count
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    token: {
      type: String,
    },
    recentChats: {
      type: [recentChatSchema], // Optional recent chat list
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Authuser = mongoose?.models?.Authuser || mongoose?.model("Authuser", userSchema);

export default Authuser;
