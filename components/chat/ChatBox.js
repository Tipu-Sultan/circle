import { useState } from "react";
import ChatHeader from "./ChatHeader";

export default function ChatBox({ recipientName, messages, sendMessage, chatRef, handleScroll, loading }) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg">
      <ChatHeader recipientName={recipientName} />
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-100"
      >
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === recipientName ? "justify-start" : "justify-end"}`}
          >
            <div className={`p-3 rounded-lg max-w-xs ${msg.sender === recipientName ? "bg-gray-300 text-black" : "bg-blue-500 text-white"}`}>
              <p>{msg.text}</p>
              <small className="text-xs block mt-1 text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-2 bg-gray-200 rounded-b-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg border"
        />
        <button
          onClick={() => {
            sendMessage(message);
            setMessage("");
          }}
          className="p-2 bg-blue-500 text-white rounded-lg ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}
