-- 1. Create Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'FREE', -- 'FREE', 'PRO', 'ENTERPRISE'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id INTEGER, -- References users(id) but loosely coupled to allow deletions
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- 'BATCH', 'USER', 'ORDER'
    resource_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Add Tenant ID to Users
-- We first check if column exists to avoid errors on re-runs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
    END IF;
END $$;

-- 4. Add Tenant ID to Batches (Manufacturing)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'batches' AND column_name = 'tenant_id') THEN
        ALTER TABLE batches ADD COLUMN tenant_id UUID REFERENCES tenants(id);
    END IF;
END $$;

-- 5. Create Default Tenant (Seed) if not exists
-- We do this in SQL to ensure data integrity immediately
INSERT INTO tenants (name, plan_type)
SELECT 'Default Organization', 'ENTERPRISE'
WHERE NOT EXISTS (SELECT 1 FROM tenants);

-- 6. Backfill Existing Users/Batches
-- Assign all NULL tenant_id records to the Default Tenant
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM tenants WHERE name = 'Default Organization' LIMIT 1;

    IF default_tenant_id IS NOT NULL THEN
        UPDATE users SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE batches SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    END IF;
END $$;
