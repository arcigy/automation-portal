-- Migration 02: Better Auth Schema with Multi-tenancy
-- This migration adds the necessary tables for Better Auth and links them to the tenants table.

-- User Table
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    createdAt TIMESTAMPTZ NOT NULL,
    updatedAt TIMESTAMPTZ NOT NULL,
    role TEXT DEFAULT 'user',
    "tenantId" UUID REFERENCES tenants(id) ON DELETE SET NULL
);

-- Session Table
CREATE TABLE session (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    token TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL,
    updatedAt TIMESTAMPTZ NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "tenantId" UUID REFERENCES tenants(id) ON DELETE SET NULL
);

-- Account Table (OAuth & Credentials)
CREATE TABLE account (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ,
    "refreshTokenExpiresAt" TIMESTAMPTZ,
    scope TEXT,
    password TEXT,
    createdAt TIMESTAMPTZ NOT NULL,
    updatedAt TIMESTAMPTZ NOT NULL
);

-- Verification Table (Email Verification, Password Reset)
CREATE TABLE verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL,
    updatedAt TIMESTAMPTZ NOT NULL
);

-- Update tenants table to match the requirements of the application logic
-- If tenant needs 'slug' or 'is_active', we can add it here.
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create an index for faster tenant lookups
CREATE INDEX IF NOT EXISTS idx_user_tenant_id ON "user"("tenantId");
CREATE INDEX IF NOT EXISTS idx_session_tenant_id ON session("tenantId");
