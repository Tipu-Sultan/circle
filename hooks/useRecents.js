import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export function useRecents() {
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const response = await axios.get(`/api/chat/recent?userId=${currentUser.id}`);
        setRecentChats(response.data);
      } catch (error) {
        console.error("Failed to fetch recent chats:", error);
      }
    };

    if (currentUser?.id) fetchRecentChats();
  }, [currentUser]);

  return { recentChats ,currentUser};
}
