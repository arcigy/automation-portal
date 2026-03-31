import { betterAuth } from "better-auth";
import { pool } from "./db";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: pool,
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
        defaultValue: "",
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
