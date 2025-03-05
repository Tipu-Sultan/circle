import Authuser from "@/models/User";

const IschatAlready = async (id, name, type, avatar, currentUserId,participants) => {
    const currentUser = await Authuser.findById(currentUserId);

    if(participants.length>0){
        if (!participants || participants.length === 0) {
            return { data: { message: "No participants found" }, status: 400 };
        }
    
        const allParticipants = new Set([...participants, currentUserId]); // Ensure current user is included
    
        // Iterate through each participant and update their recentChats
        for (const participantId of allParticipants) {
            const user = await Authuser.findById(participantId);
    
            if (user) {
                // Check if the chat (group) already exists in recentChats
                const existingChat = user.recentChats.find(chat => chat.chatId?.toString() === id);
    
                if (!existingChat) {
                    // Add new group to recentChats
                    user.recentChats.push({ chatId: id, name, type, avatar });
                    await user.save();
                }
            }
        }

        // Get the newly added chat from recentChats (last item)
    const newChat = currentUser.recentChats[currentUser.recentChats.length - 1];

    return { 
        data: { message: "Recent chat updated", newChat }, 
        status: 200 
    };

    }else{
        // Find the current user
    if (!currentUser) {
        return { data: { message: "User not found" }, status: 404 };
    }

    // Check if the chat already exists
    const existingChat = currentUser.recentChats.find(
        (chat) => chat.chatId?.toString() === id
    );

    if (existingChat) {
        return { 
            data: { message: `${type === "group" ? "Group" : "Chat"} already exists` },
            status: 400
        };
    }

    // Add new chat to recentChats
    currentUser.recentChats.push({ chatId: id, name, type, avatar });
    await currentUser.save();

    // Get the newly added chat from recentChats (last item)
    const newChat = currentUser.recentChats[currentUser.recentChats.length - 1];

    return { 
        data: { message: "Recent chat updated", newChat }, 
        status: 200 
    };
    }
};


export default IschatAlready;