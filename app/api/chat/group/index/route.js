import dbConnect from '@/lib/db';
import GroupMessage from '@/models/GroupMessage';

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const recipient = searchParams.get('groupId'); // Can be user ID or group ID
    const type = searchParams.get('type'); // Determines if it's a user or group message
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!recipient || !type) {
      return Response.json({ error: 'Missing groupId or type' }, { status: 400 });
    }

    let messages;

    if (type === 'user') {
      // Return messages with sender and recipient as IDs only (One-to-One Chat)
      messages = await GroupMessage.find({ recipient })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id sender recipient text timestamp') // Select only required fields
        .lean();
    } else if (type === 'group') {
      // Return messages with sender details populated (Group Chat)
      messages = await GroupMessage.find({ recipient })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', '_id name avatar') // Populate sender details
        .lean();
    } else {
      return Response.json({ error: 'Invalid type. Use "user" or "group"' }, { status: 400 });
    }

    return Response.json(messages.reverse(), { status: 200 }); // Reverse for correct order
  } catch (error) {
    return Response.json({ error: 'Failed to fetch messages', details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { sender, recipient, text, timestamp, type } = await req.json();

    if (!sender || !recipient || !text || !type) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save the new message
    const message = await GroupMessage.create({
      sender,
      recipient,
      text,
      timestamp: timestamp || new Date(),
    });

    let newMessage;

    if (type === 'user') {
      // Return message with sender & recipient IDs only (One-to-One Chat)
      newMessage = await GroupMessage.findOne({ _id: message._id })
        .select('_id sender recipient text timestamp')
        .lean();
    } else if (type === 'group') {
      // Return message with sender details populated (Group Chat)
      newMessage = await GroupMessage.findOne({ _id: message._id })
        .populate('sender', '_id name avatar')
        .lean();
    } else {
      return Response.json({ error: 'Invalid type. Use "user" or "group"' }, { status: 400 });
    }

    return Response.json(newMessage, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to save message", details: error.message }, { status: 500 });
  }
}
