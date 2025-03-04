"use client";
import { useEffect, useState } from "react";
import { getAblyClient } from "@/lib/ablyClient";
import {useRouter} from "next/navigation";

const FollowButton = ({ userId,user, currentUser }) => {
    const router = useRouter();
  const [status, setStatus] = useState("Follow"); // Default state
  const [loading, setLoading] = useState(true); // Track initial fetch

  if (!currentUser || !userId) return null; // Prevent errors if users aren't defined

  const client = getAblyClient(currentUser?.id);
  const channelName = `follow-${[userId, currentUser?.id].sort().join("-")}`;
  const channel = client?.channels?.get(channelName);

  // 🟢 Fetch follow status from the database on mount
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`/api/follow?followerId=${currentUser.id}&followingId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          if (data.status === "pending") {
            setStatus("Requested");
          } else if (data.status === "accepted") {
            setStatus("Following");
          } else {
            setStatus("Follow");
          }
        } else {
          setStatus("Follow");
        }
      } catch (error) {
        console.error("Error fetching follow status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [userId, currentUser]);

  // 🟠 Listen for real-time follow updates
  useEffect(() => {
    if (!channel) return;

    client.connection.once("connected", () => {
      channel.subscribe("follow-update", (message) => {
        console.log("Follow Update Received:", message.data);

        if (message.data.followerId === userId && message.data.status === "pending") {
          setStatus("Confirm"); // Receiver sees "Confirm"
        } else if (
          (message.data.followerId === userId || message.data.followingId === userId) &&
          message.data.status === "accepted"
        ) {
          setStatus("Following"); // Both users see "Following"
        } else if (
          (message.data.followerId === userId || message.data.followingId === userId) &&
          message.data.status === "removed"
        ) {
          setStatus("Follow"); // Reset to "Follow"
        }
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [client, channel, userId, currentUser]);

  // 🟡 Handle follow request
  const handleFollow = async () => {
    if (status === "Follow") {
      setStatus("Requesting...");

      try {
        const response = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            followerId: currentUser.id,
            followingId: userId,
          }),
        });

        if (response.ok) {
          setStatus("Requested");
          channel.publish("follow-update", {
            followerId: currentUser.id,
            followingId: userId,
            status: "pending",
          });
        } else {
          setStatus("Follow");
          alert("Error sending follow request.");
        }
      } catch (error) {
        console.error("Follow error:", error);
        setStatus("Follow");
      }
    } else if (status === "Requested" || status === "Following") {
      await handleUnfollow();
    }
  };

  // 🟢 Handle confirming a follow request
  const handleConfirm = async () => {
    setStatus("Following...");

    try {
      const response = await fetch("/api/follow", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: userId,
          followingId: currentUser.id,
        }),
      });

      if (response.ok) {
        setStatus("Following");
        channel.publish("follow-update", {
          followerId: userId,
          followingId: currentUser.id,
          status: "accepted",
        });
      } else {
        setStatus("Confirm");
        alert("Error confirming follow request.");
      }
    } catch (error) {
      console.error("Confirm error:", error);
      setStatus("Confirm");
    }
  };

  // 🔴 Handle unfollowing a user
  const handleUnfollow = async () => {
    setStatus("Unfollowing...");

    try {
      const response = await fetch("/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: userId,
        }),
      });

      if (response.ok) {
        setStatus("Follow");
        channel.publish("follow-update", {
          followerId: currentUser.id,
          followingId: userId,
          status: "removed",
        });
      } else {
        setStatus("Following");
        alert("Error unfollowing user.");
      }
    } catch (error) {
      console.error("Unfollow error:", error);
      setStatus("Following");
    }
  };

  const handleAddRecents = async () => {
    const UserData = {
        id: userId,
        name: user?.name,
        type: "user",
        currentUserId: currentUser?.id, // Ensure the current user's ID is sent
    };

    try {
        const response = await fetch("/api/auth/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(UserData), // Fix: Convert to JSON string
        });

        if (response.ok) {
            router.push("/chat");
        } else {
            alert("Error adding recent chat.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


  // 🛑 Show a loading state while fetching status
  if (loading) return <button className="px-4 py-2 bg-gray-300 rounded">Loading...</button>;

  return (
    <>
      <button
        onClick={status === "Confirm" ? handleConfirm : handleFollow}
        disabled={["Requesting...", "Unfollowing...", "Following..."].includes(status)}
        className={`px-4 py-2 text-sm rounded-lg transition ${
          status === "Requested"
            ? "bg-gray-400 text-white cursor-not-allowed"
            : status === "Confirm"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : status === "Following"
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {status === "Following" ? "Unfollow" : status}
      </button>

      {status === "Following" && <button onClick={handleAddRecents} className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white">Meesage</button>}
    </>
  );
};

export default FollowButton;
