import { randomUUID } from "crypto";
import { pool } from "../src/lib/db";

async function createAdmin(email: string) {
  const userId = randomUUID();
  const tenantId = randomUUID(); // Create a default tenant for the admin
  
  try {
    // 1. Create a "Root" Tenant
    await pool.query(
      `INSERT INTO tenants (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [tenantId, "Arcigy Root", "arcigy-root"]
    );

    // 2. Insert the User
    // Note: Better Auth uses its own structure, so we insert into the 'user' table
    // with role 'admin' and the tenantId we just created.
    await pool.query(
      `INSERT INTO "user" (id, email, name, role, "tenantId", emailVerified, createdAt, updatedAt) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [userId, email, "Root Admin", "admin", tenantId, true]
    );

    // 3. Set the password? Better Auth stores passwords in 'account' table for credential provider
    // Normally you'd want to use better-auth's internal hasher but for a quick script:
    // We'll just print a instruction to use the portal or a more complete script.
    
    console.log(`✅ Admin user created: ${email}`);
    console.log(`✅ Tenant ID: ${tenantId}`);
    console.log(`⚠️ Password must be set via the 'account' table or reset link.`);
  } catch (e) {
    console.error("❌ Failed to create admin:", e);
  } finally {
    process.exit();
  }
}

const [,, email] = process.argv;
if (!email) {
  console.log("Usage: bun scripts/create-admin.ts <email> <password>");
} else {
  createAdmin(email);
}
