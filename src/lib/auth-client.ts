import { createAuthClient } from "better-auth/client";

const rawBaseURL = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL;
const baseURL = rawBaseURL && !rawBaseURL.startsWith("http") 
  ? `https://${rawBaseURL}` 
  : rawBaseURL;

export const authClient = createAuthClient({
    baseURL,
});

export const { useSession, signIn, signOut } = authClient;
