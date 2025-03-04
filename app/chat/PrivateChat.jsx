"use client";
import { useState } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import { useChat } from "@/hooks/useChats";
import { useRecents } from "@/hooks/useRecents";

export default function ChatPage() {
  const { recentChats, currentUser } = useRecents();

  const [activeChatUser, setActiveChatUser] = useState(null);

  // Only initialize useChat when a recipient is selected
  const chatProps = useChat(currentUser, activeChatUser?.chatId);

  return (
    <div className="flex w-full h-screen">
      <UserList recentChats={recentChats} onSelectUser={setActiveChatUser} />
      <ChatWindow 
        currentUser={currentUser} 
        recipient={activeChatUser} 
        {...chatProps}  // Pass all chat-related props
      />
    </div>
  );
}
