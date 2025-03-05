import { FiMoreVertical, FiSend } from "react-icons/fi";
import { useEffect, useRef } from "react";
import { timeAgo } from "@/utils/timeAgo";

export default function ChatWindow({ 
  recipient, 
  currentUser, 
  messages, 
  message, 
  setMessage, 
  sendMessage, 
  handleScroll, 
  chatRef, 
  loading 
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef?.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!recipient) {
    return (
      <div className="w-2/3 flex items-center justify-center h-screen text-gray-600 text-lg">
        Select a user or group to start chatting
      </div>
    );
  }

  return (
    <div className="w-2/3 h-screen flex flex-col bg-white shadow-md border border-gray-300 rounded-lg">
      {/* Chat Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-5 py-4 shadow-lg rounded-t-lg">
        <div className="flex items-center gap-3">
          <img 
            src={recipient?.avatar || "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png"} 
            alt={recipient?.name || "User"} 
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-lg font-semibold">{recipient?.name}</h2>
        </div>
        <FiMoreVertical size={24} className="cursor-pointer hover:opacity-80 transition-opacity" />
      </div>

      {/* Chat Messages */}
      <div 
        onScroll={handleScroll} 
        ref={chatRef} 
        className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3"
      >
        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {messages?.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages?.map((msg, index) => {
            const isCurrentUser = msg.sender?._id === currentUser.id;
            const isGroupChat = recipient.type === "group";

            return (
              <div 
                key={index} 
                className={`flex items-start gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                {/* Show Avatar & Name for Group Messages */}
                {!isCurrentUser && isGroupChat && (
                  <img 
                    src={msg.sender?.avatar || "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png"} 
                    alt={msg.sender?.name || "User"} 
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div className={`max-w-xs p-3 rounded-lg shadow-md text-sm leading-relaxed ${isCurrentUser 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-gray-200 text-black rounded-bl-none"}`}>

                  {/* Show Sender Name in Group Messages */}
                  {!isCurrentUser && isGroupChat && (
                    <p className="text-xs font-semibold text-blue-600 mb-1">
                      {msg.sender?.name}
                    </p>
                  )}

                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {timeAgo(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 flex items-center bg-white border-t">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button 
          onClick={sendMessage} 
          className={`ml-2 p-3 rounded-full text-white transition flex items-center justify-center ${
            message.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!message.trim()}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}
