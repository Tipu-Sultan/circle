import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export function useUsers() {
  const { data: session,status } = useSession();
  const currentUser = session?.user ?? null;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/auth/users");
        setUsers(response.data.users.filter(user => user.id !== currentUser?.id));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (currentUser?.id) fetchUsers();
  }, [currentUser]);

  return { users,currentUser };
}
