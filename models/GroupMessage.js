import mongoose from 'mongoose';

const GroupMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Authuser", required: true }, // Reference to User
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true }, // Reference to Group
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.GroupMessage || mongoose.model('GroupMessage', GroupMessageSchema);
