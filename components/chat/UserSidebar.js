export default function UserSidebar({ users, selectUser }) {
    return (
      <div className="w-1/3 bg-gray-100 p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => selectUser(user)}
              className="p-2 bg-white shadow-sm rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition"
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  