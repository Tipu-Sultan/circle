"use client";
import { useUsers } from "@/hooks/useUsers";
import { useSession } from "next-auth/react";
import FollowButton from "../follow/FollowButton";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { users, currentUser } = useUsers();
  

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You are not logged in. Please sign in.</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <p>Email: {session?.user?.email}</p>

      <h2 className="mt-6 text-lg font-semibold">Users</h2>
      <div className="mt-4 space-y-3">
        {users?.length > 0 ? (
          users
            .filter(user => user.id !== currentUser?.id) // Exclude self
            .map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 shadow-sm">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <FollowButton user={user} userId={user.id} currentUser={currentUser} />
              </div>
            ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
