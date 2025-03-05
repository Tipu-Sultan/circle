"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import GroupModal from "@/mod/GroupModal";

export default function UserList({ onSelectUser,setRecentChats,currentUser, recentChats }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-1/3 p-4 border-r h-screen bg-gray-100 relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Recent Chats</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>

      {recentChats?.length === 0 ? (
        <p className="text-gray-500">No active recent chats</p>
      ) : (
        recentChats?.map((user) => (
          <button
            key={user.chatId}
            onClick={() => onSelectUser(user)}
            className="w-full p-3 mb-2 bg-white rounded-lg shadow-sm hover:bg-blue-100"
          >
            {user.name}
          </button>
        ))
      )}

      <GroupModal setRecentChats={setRecentChats} userId={currentUser?.id} friends={recentChats} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
