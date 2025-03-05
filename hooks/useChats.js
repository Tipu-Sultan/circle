import { useState, useEffect, useRef } from "react";
import { getAblyClient } from "@/lib/ablyClient";

export function useChat(user, activeChatUser, recipientId) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const chatRef = useRef(null);

  // Get Ably client instance
  const client = getAblyClient(user?.id || null);
  const channelName =
    activeChatUser?.type === "group"
      ? recipientId
      : [user?.id, recipientId].sort().join("-");
  const channel = client?.channels?.get(channelName);

  // Subscribe to messages
  useEffect(() => {
    if (!channel) return;

    channel.subscribe("message", (msg) => {
      setMessages((prev) => [...prev, msg?.data ?? {}]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  // Fetch messages from backend
  const fetchMessages = async (pageNum) => {
    if (!user?.id || !recipientId) return;
    setLoading(true);

    try {
      const url =
        activeChatUser?.type === "group"
          ? `/api/chat/group/index?groupId=${recipientId}&page=${pageNum}&type=group`
          : `/api/chat/user?sender=${user.id}&recipient=${recipientId}&page=${pageNum}&type=user`;

      const res = await fetch(url);
      const data = await res.json();

      setMessages((prev) => (pageNum === 1 ? data : [...data, ...prev]));
      setHasMore(data.length === 20); // Adjust pagination limit
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a message (handles user & group chats)
  const sendMessage = async () => {
    if (message.trim() === "" || !user?.id) return;

    const msgData = {
      sender: user.id,
      recipient: recipientId, // For group chats, this is groupId
      type: activeChatUser?.type,
      text: message,
      timestamp: new Date(),
    };

    channel?.publish("message", msgData);

    const url =
      activeChatUser?.type === "group"
        ? "/api/chat/group/index"
        : "/api/chat/user";

    await fetch(url, {
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
