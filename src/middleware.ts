import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // This is a basic session check logic. 
    // In Better Auth, you might need to use getSession(auth) or similar strategy for middleware.
    // However, App Router middleware is tricky with sessions. 
    // Usually recommended to check session inside Server Components/Actions.
    
    // Placeholder for simplified middleware logic
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
