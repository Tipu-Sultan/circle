import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatHeader({ recipientName }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
      <h2 className="text-lg font-semibold">{recipientName}</h2>
      <div className="relative">
        <BsThreeDotsVertical
          className="text-xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
            <ul className="text-gray-700 text-sm">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">View Profile</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Block User</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Delete Chat</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
