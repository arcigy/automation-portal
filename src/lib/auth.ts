import { betterAuth } from "better-auth";
import { pool } from "./db";
import { admin } from "better-auth/plugins";

const rawBaseURL = process.env.BETTER_AUTH_URL;
const baseURL = rawBaseURL && !rawBaseURL.startsWith("http") 
  ? `https://${rawBaseURL}` 
  : rawBaseURL;

export const auth = betterAuth({
  database: pool,
  baseURL: baseURL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin(), // Manage roles like 'admin'
  ],
  user: {
    additionalFields: {
      tenantId: {
        type: "string",
        required: false,
        input: false,
      },
    }
  },
  session: {
    additionalFields: {
      tenantId: {
        type: "string",
      }
    }
  }
});
