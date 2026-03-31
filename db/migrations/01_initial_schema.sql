-- Enable pgcrypto for password hashing or general encryption if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    slug TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant Automations (mapping tenants to automations with settings)
CREATE TABLE IF NOT EXISTS tenant_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    automation_id TEXT NOT NULL,
    settings JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Logs
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    automation_id TEXT NOT NULL,
    status TEXT NOT NULL,
    input JSONB,
    output JSONB,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
