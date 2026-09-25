import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@admin/lib/auth";
import { absoluteUrl } from "@admin/lib/http";

/** Drop the session cookie and land back on the login page. */
export async function POST(request: Request) {
  const response = NextResponse.redirect(absoluteUrl(request, "/admin/login/"), 303);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
