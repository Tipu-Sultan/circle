import { FiMoreVertical, FiSend } from "react-icons/fi";
import { useEffect, useRef } from "react";

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
    // Auto-scroll to the latest message
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
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="w-2/3 h-screen flex flex-col bg-white shadow-md border border-gray-300 rounded-lg">
      {/* Chat Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-5 py-4 shadow-lg rounded-t-lg">
        <h2 className="text-lg font-semibold">{recipient.name}</h2>
        <div className="flex items-center gap-3">
          <FiMoreVertical size={24} className="cursor-pointer hover:opacity-80 transition-opacity" />
        </div>
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
          messages?.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`p-3 max-w-xs rounded-lg shadow-md text-sm leading-relaxed ${
                  msg.sender === currentUser.id 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
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
