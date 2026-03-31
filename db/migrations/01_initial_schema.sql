-- Enable pgcrypto for password hashing or general encryption if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles/Users (integrating with better-auth's default schema if possible, or custom)
-- Better Auth usually creates its own tables (user, session, account, verification),
-- so we'll add a tenant_id to the user table or handle it in a mapping table.
-- Let's stick to the user's explicit table requirements first.

-- Tenant Automations (mapping tenants to automations with settings)
CREATE TABLE tenant_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    automation_id TEXT NOT NULL, -- Logical ID of the automation
    settings JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Logs
CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    automation_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'error', 'running'
    input JSONB,
    output JSONB,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Admin user (seed) - better handled via better-auth setup but table structure needed.
