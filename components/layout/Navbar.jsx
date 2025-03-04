"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession(); 
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around list-none text-white">
        <li>
          <Link href="/">Home</Link>
        </li>



        {session ? (
          <>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/chat">Chat</Link>
            </li>
            <li>
              <button onClick={() => signOut()} className="cursor-pointer">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
