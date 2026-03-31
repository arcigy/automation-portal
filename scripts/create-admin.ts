/**
 * Seed script: creates the root admin via Better Auth's internal API.
 * Run: tsx scripts/create-admin.ts <email> <password>
 *
 * Requires the server to be running (or DATABASE_URL in env).
 * Uses Better Auth's auth.api.signUpEmail to correctly hash the password.
 */
import { auth } from "../src/lib/auth";
import { pool } from "../src/lib/db";
import { randomUUID } from "crypto";

async function createAdmin(email: string, password: string) {
  try {
    // 1. Create root tenant first
    const tenantId = randomUUID();
    await pool.query(
      `INSERT INTO tenants (id, name, slug, email) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING`,
      [tenantId, "Arcigy Root", "arcigy-root", email]
    );

    // Get the actual tenant ID (may already exist)
    const tenantResult = await pool.query(
      `SELECT id FROM tenants WHERE slug = 'arcigy-root' LIMIT 1`
    );
    const actualTenantId = tenantResult.rows[0]?.id;

    // 2. Use Better Auth to create the user (this correctly hashes the password)
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Root Admin",
      },
      headers: new Headers({
        "User-Agent": "Admin-Seeder"
      })
    }).catch(r => r);

    if (!response || !response.user?.id) {
      console.log("Full Better Auth Response:", JSON.stringify(response, null, 2));
      throw new Error("Failed to create user via Better Auth. See output above.");
    }

    // 3. Promote to admin and set tenantId
    await pool.query(
      `UPDATE "user" SET role = 'admin', "tenantId" = $1 WHERE id = $2`,
      [actualTenantId, response.user.id]
    );

    console.log(`✅ Admin user created!`);
    console.log(`   Email:    ${email}`);
    console.log(`   User ID:  ${response.user.id}`);
    console.log(`   Tenant:   ${actualTenantId}`);
    console.log(`\n🚀 You can now log in at your Railway URL.`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("❌ Failed to create admin:", msg);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const [,, email, password] = process.argv;
if (!email || !password) {
  console.error("Usage: tsx scripts/create-admin.ts <email> <password>");
  process.exit(1);
} else {
  createAdmin(email, password);
}
