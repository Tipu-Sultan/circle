import { useState, useEffect, useRef } from "react";
import { getAblyClient } from "@/lib/ablyClient";

export function useChat(user, recipientId) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const chatRef = useRef(null);

  const client = getAblyClient(user?.id || null);
  const channelName = [user?.id, recipientId].sort().join("-");
  const channel = client?.channels?.get(channelName);

  useEffect(() => {
    if (!channel) return;

    // Subscribe to messages
    channel.subscribe("message", (msg) => {
      setMessages((prev) => [...prev, msg?.data ?? {}]);
    });

    // Cleanup on component unmount
    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  // Fetch messages function
  const fetchMessages = async (pageNum) => {
    if (!user?.id || !recipientId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/user?sender=${user.id}&recipient=${recipientId}&page=${pageNum}`);
      const data = await res.json();

      setMessages((prev) => (pageNum === 1 ? data : [...data, ...prev]));
      setHasMore(data.length === 20); // Adjust for pagination
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    setLoading(false);
  };


  useEffect(() => {
    fetchMessages(1);
  }, [user?.id, recipientId]);

  // Infinite Scroll: Fetch older messages
  const handleScroll = () => {
    if (chatRef.current?.scrollTop === 0 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "" || !user?.id) return;

    const msgData = {
      sender: user.id,
      recipient: recipientId,
      text: message,
      timestamp: new Date(),
    };

    channel?.publish("message", msgData);

    await fetch("/api/chat/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });

    setMessage("");
  };

  return {
    messages,
    message,
    setMessage,
    sendMessage,
    handleScroll,
    chatRef,
    loading,
  };
}
