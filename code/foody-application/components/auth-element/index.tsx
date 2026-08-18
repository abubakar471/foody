"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/components/button";

export default function AuthElement() {
  const { data: session, status } = useSession();

  // Show a clean loading state while NextAuth retrieves session state
  if (status === "loading") {
    return (
      <div className="h-9 w-32 animate-pulse bg-gray-200 rounded-lg" />
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      {status === "authenticated" && session?.user ? (
        <>
          <span className="text-sm text-gray-300">
            Hi, <b className="font-semibold text-gray-400">{session.user.name}</b>
          </span>

          <nav className="flex items-center gap-3">
            <Link href={`/wishlist/${session.user.id}`}>
              <Button variant="outline">Your wish list</Button>
            </Link>

            <Button variant="green" onClick={() => signOut()}>
              Sign out
            </Button>
          </nav>
        </>
      ) : (
        <nav className="flex items-center">
          <Button variant="green" onClick={() => signIn()}>
            Sign in
          </Button>
        </nav>
      )}
    </div>
  );
}
