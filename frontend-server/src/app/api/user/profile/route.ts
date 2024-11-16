import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// Define an interface for the session user
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
    
    // Log the session object for debugging
    console.log("Session:", session);

    // Check if session and session.user exist
    if (session && session.user) {
      const { id, firstName, lastName, email, accountType } = session.user;

      // Check if all required user properties exist
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
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 