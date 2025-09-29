"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="text-sm text-uzg-300/70">…</div>;

  const btnClass =
    "rounded-lg border border-board-line bg-board-soft px-3 py-1.5 text-sm text-uzg-400 hover:border-uzg-500"

  if (!session) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span>Want to edit?</span>
        <Link href="/login" className={btnClass}>
          Log in
        </Link>
      </div>
    );
  }

  const name = session.user?.name || session.user?.email || "user";

  const onSignOut = async () => {
    await signOut({ redirect: false });
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <span>You’re in, {name}</span>
      <button onClick={onSignOut} className={btnClass}>
        Sign out
      </button>
    </div>
  );
}