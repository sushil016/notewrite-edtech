// src/app/api/user/profile/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";  // Updated import

interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as { user?: SessionUser };
    
    console.log("Session:", session);

    if (session && session.user) {
      const { id, firstName, lastName, email, accountType } = session.user;

      if (id && firstName && lastName && email && accountType) {
        return NextResponse.json({
          success: true,
          user: {
            id,
            firstName,
            lastName,
            email,
            accountType,
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, message: "User information is incomplete" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Profile route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}