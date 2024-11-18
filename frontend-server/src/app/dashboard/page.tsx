"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!loading && user?.accountType === 'STUDENT') {
      router.push('/');
      return;
    }
  }, [loading, isAuthenticated, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 pt-20 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!user || user.accountType === 'STUDENT') {
    return (
      <div className="min-h-screen p-8 pt-20 flex justify-center items-center">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-20 flex justify-center items-center">
      <h1>Welcome to {user.accountType} Dashboard, {user.firstName}!</h1>
    </div>
  );
} 