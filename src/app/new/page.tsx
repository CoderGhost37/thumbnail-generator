"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function NewPage() {
  const { data, isPending } = authClient.useSession();

  const logout = async () => {
    await authClient.signOut();
  };
  return isPending ? (
    <div>Loading...</div>
  ) : data?.user ? (
    <button type="button" onClick={logout}>
      Logout
    </button>
  ) : (
    <Link href="/login">Login</Link>
  );
}
