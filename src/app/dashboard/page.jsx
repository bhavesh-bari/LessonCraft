"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage({ searchParams }) {

  const { data: session } = useSession();
  console.log("session data",session); // check if you see `session.accessToken`
  return (
    <div>
      <h1>Welcome to your Dashboard 🎉</h1>
      {searchParams.google === "connected" && (
        <p>✅ Google account connected successfully!</p>
      )}
    </div>
  );
}
