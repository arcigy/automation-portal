import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    // baseURL: process.env.BETTER_AUTH_URL, // Not needed with Next.js usually
});

export const { useSession, signIn, signOut } = authClient;
