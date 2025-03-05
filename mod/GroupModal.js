"use client";

import { Dialog, Tab } from "@headlessui/react";
import { useState } from "react";
import { X } from "lucide-react";
import { generateGroupId } from "@/utils/GroupId";
import axios from "axios";

export default function GroupModal({ friends,userId,setRecentChats, isOpen, onClose }) {
  const [selectedTab, setSelectedTab] = useState("create");
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupId, setGroupId] = useState("");

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedFriends.length === 0) {
      alert("Group name and at least one participant are required.");
      return;
    }

    setIsLoading(true); // Show loading spinner
  
    const groupData = {
      groupId: generateGroupId(groupName), // Generate a unique group ID
      type: "group",
      avatar:'',
      name: groupName,
      createdBy: userId, 
      admins: [userId],
      participants: selectedFriends, 
    };
  
    try {
      const response = await axios.post("/api/chat/group/create", groupData, {
        headers: { "Content-Type": "application/json" },
      });

      setRecentChats((prev) => [...prev, response.data.result.data.newChat]);
      setIsLoading(false);
      onClose(); 
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating group:", error.response?.data || error.message);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
  
    try {
      const response = await axios.post("/api/chat/group/join", { groupId, userId }, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response)
      setRecentChats((prev) => [...prev, response.data.result.data.newChat]);
      setIsLoading(false);
      onClose(); 
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating group:", error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed shadow-xl inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition">
          <X size={20} />
        </button>
        
        <Tab.Group>
          <Tab.List className="flex border-b mb-4">
            <Tab
              className={({ selected }) =>
                `flex-1 p-2 text-center cursor-pointer transition ${selected ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"}`
              }
              onClick={() => setSelectedTab("create")}
            >
              Create Group
            </Tab>
            <Tab
              className={({ selected }) =>
                `flex-1 p-2 text-center cursor-pointer transition ${selected ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"}`
              }
              onClick={() => setSelectedTab("join")}
            >
              Join Group
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            <Tab.Panel>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-400"
              />
              <div className="h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                {friends?.map((friend) => (
                  <label key={friend?.chatId} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.chatId)}
                      onChange={() => toggleFriendSelection(friend.chatId)}
                      className="accent-blue-500"
                    />
                    {friend.name}
                  </label>
                ))}
              </div>
              <button onClick={handleCreateGroup} className="w-full p-2 bg-blue-500 text-white rounded mt-3 hover:bg-blue-600 transition">
                {isLoading?'Createing Group...':'Create Group'}
              </button>
            </Tab.Panel>
            
            <Tab.Panel>
              <input
                type="text"
                placeholder="Enter group ID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-green-400"
              />
              <button onClick={handleJoinGroup} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Join Group
              </button>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Dialog>
  );
}
