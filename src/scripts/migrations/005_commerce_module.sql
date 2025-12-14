-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id), -- Buyer (if logged in)
    seller_tenant_id UUID REFERENCES tenants(id), -- Seller (Platform/Vendor)

    order_number VARCHAR(50) UNIQUE NOT NULL, -- Human readable ID (e.g., RFQ-2024-001)
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, QUOTED, APPROVED, REJECTED, PAID, COMPLETED

    total_amount DECIMAL(12, 2), -- Estimated value
    currency VARCHAR(3) DEFAULT 'INR',

    customer_details JSONB, -- { name, email, phone, company } for Guest Checkout

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

    item_name VARCHAR(255) NOT NULL,
    item_reference_id VARCHAR(100), -- Internal SKU or Batch ID if applicable

    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',

    requested_price DECIMAL(10, 2), -- Target price from buyer (optional)
    quoted_price DECIMAL(10, 2), -- Price offered by seller

    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
