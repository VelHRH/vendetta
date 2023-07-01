import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
 const res = NextResponse.next();
 const supabase = createMiddlewareClient({ req, res });

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();

 if (user) {
  if (
   req.nextUrl.pathname.includes("sign-in") ||
   req.nextUrl.pathname.includes("sign-up") ||
   req.nextUrl.pathname.includes("reset-password")
  ) {
   return NextResponse.redirect(new URL("/", req.url));
  }
 }

 if (!profile || profile.role !== "admin") {
  if (
   req.nextUrl.pathname.endsWith("/add") ||
   req.nextUrl.pathname.includes("/edit?")
  ) {
   return NextResponse.redirect(new URL("/", req.url));
  }
 }
 return res;
}

export const config = {
 matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
