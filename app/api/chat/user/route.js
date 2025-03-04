import dbConnect from '@/lib/db';
import Message from '@/models/Message';

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get('sender');
    const recipient = searchParams.get('recipient');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!sender || !recipient) {
      return Response.json({ error: 'Missing sender or recipient' }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    })
      .sort({ timestamp: -1 }) 
      .skip(skip)
      .limit(limit);

    return Response.json(messages.reverse(), { status: 200 }); // Reverse for proper order
  } catch (error) {
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { sender, recipient, text, timestamp } = await req.json();

    if (!sender || !recipient || !text) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const message = await Message.create({
      sender,
      recipient,
      text,
      timestamp: timestamp || new Date(),
    });

    return Response.json(message, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
