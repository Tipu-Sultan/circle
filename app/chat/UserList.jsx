"use client";

export default function UserList({ onSelectUser,recentChats }) {

  return (
    <div className="w-1/3 p-4 border-r h-screen bg-gray-100">
      <h2 className="text-lg font-semibold mb-3">recentChats</h2>
      {recentChats?.length === 0 ? (
        <p className="text-gray-500">No active recentChats</p>
      ) : (
        recentChats?.map((user) => (
          <button
            key={user.chatId}
            onClick={() => onSelectUser(user)}
            className="w-full p-3 mb-2 bg-white rounded-lg shadow-sm hover:bg-blue-100"
          >
            {user.name}
          </button>
        ))
      )}
    </div>
  );
}
