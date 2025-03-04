import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authuser", // Refers to the user who follows
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authuser", // Refers to the user being followed
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "accepted", // Can be used for follow requests (if needed)
    },
    followedAt: {
      type: Date,
      default: Date.now, // Timestamp when follow happened
    },
  },
  { timestamps: true }
);

// Ensure a user cannot follow the same person twice
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);

export default Follow;
