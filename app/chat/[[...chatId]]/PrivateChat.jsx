"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For App Router
import ChatWindow from "./ChatWindow";
import { useChat } from "@/hooks/useChats";
import { useRecents } from "@/hooks/useRecents";
import { useParams } from "next/navigation";
import UserList from "./UserList";

export default function ChatPage() {
  const router = useRouter(); // Initialize router
  const { chatId } = useParams(); // chatId is an array
  const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId; // Extract first element
  const { recentChats, setRecentChats, currentUser } = useRecents();

  const [activeChatUser, setActiveChatUser] = useState(null);

  // Set activeChatUser when chatId changes
useEffect(() => {
  if (chatIdValue) {
    const foundUser = recentChats.find(user => user.chatId === chatIdValue);
    if (foundUser) {
      setActiveChatUser(foundUser);
    }
  }
}, [chatIdValue]);

  // Handle user selection and update URL
  const handleSelectUser = (user) => {
    if(user.chatId === activeChatUser?.chatId) return; 
    setActiveChatUser(user);
    router.push(`/chat/${user.chatId}`); // Update URL dynamically
  };

  // Only initialize useChat when a recipient is selected
  const chatProps = useChat(currentUser, activeChatUser, chatId);

  return (
    <div className="flex w-full h-screen">
      <UserList
        setRecentChats={setRecentChats}
        currentUser={currentUser}
        recentChats={recentChats}
        onSelectUser={handleSelectUser} // Pass updated handler
      />
      <ChatWindow 
        currentUser={currentUser} 
        recipient={activeChatUser} 
        {...chatProps}  // Pass all chat-related props
      />
    </div>
  );
}
