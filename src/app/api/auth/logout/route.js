import { NextResponse } from "next/server";
import { successResponse } from "@/lib/utils/apiResponse";

export async function POST() {
  try {
    // const response = NextResponse.json(
    //   successResponse("Logged out successfully.", null),
    //   { status: 200 },
    // );
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully.", data: null },
      { status: 200 },
    );
    // Clear the admin_token cookie by setting maxAge to 0.
    // The browser immediately treats a maxAge=0 cookie as expired and deletes it.
    // We must mirror the same path and other attributes used when setting the cookie
    // so the browser correctly matches and removes the right entry.
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // tells the browser to delete this cookie immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Logout] Unexpected error:", error);

    // Even if something goes wrong server-side, attempt to clear the cookie
    // so the user is not stuck in a broken logged-in state.
    const response = NextResponse.json(
      {
        success: false,
        message: "Logout failed. Please try again.",
        data: null,
      },
      { status: 500 },
    );

    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  }
}
