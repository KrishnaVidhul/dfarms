
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function getInventory() {
    try {
        const res = await pool.query('SELECT * FROM inventory ORDER BY id DESC');
        return res.rows;
    } catch (err) {
        console.error('Error fetching inventory:', err);
        return [];
    }
}

export async function getMarketPrices() {
    try {
        const res = await pool.query('SELECT * FROM market_prices ORDER BY fetched_at DESC');
        return res.rows;
    } catch (err) {
        console.error('Error fetching market prices:', err);
        return [];
    }
}

export async function getFinanceMetrics() {
    return {
        revenue: 79800,
        profit: 45000,
        pending_invoices: 3,
        expenses: 34800,
        invoices: [
            { id: 101, invoice_number: 'INV-2024-001', customer_name: 'Reliance Retail', total_amount: 15000.00, pdf_path: '#' },
            { id: 102, invoice_number: 'INV-2024-002', customer_name: 'BigBasket', total_amount: 22000.50, pdf_path: '#' },
            { id: 103, invoice_number: 'INV-2024-003', customer_name: 'Local Dealer', total_amount: 8000.00, pdf_path: '#' }
        ]
    };
}

export async function getBusinessMetrics() {
    return {
        leads: [
            { id: 1, name: 'Reliance Retail', status: 'Negotiating', value: '₹5L' },
            { id: 2, name: 'BigBasket', status: 'Closed', value: '₹12L' },
            { id: 3, name: 'Local Mandi', status: 'New', value: '₹50k' }
        ],
        compliance: [
            { id: 1, license_name: 'FSSAI License', status: 'Active', expiry_date: '2025-12-31' },
            { id: 2, license_name: 'APMC Trader Permit', status: 'Active', expiry_date: '2025-06-30' },
            { id: 3, license_name: 'Fire Safety Cert', status: 'Expired', expiry_date: '2023-11-01' }
        ]
    };
}

// Observability Fetchers
export async function getAgentHeartbeats() {
    try {
        const res = await pool.query('SELECT * FROM agent_heartbeats ORDER BY last_active DESC');
        return res.rows;
    } catch (err) {
        console.error('Error fetching heartbeats:', err);
        return [];
    }
}

export async function getAgentLogs() {
    try {
        const res = await pool.query('SELECT * FROM agent_logs ORDER BY created_at DESC LIMIT 50');
        return res.rows;
    } catch (err) {
        console.error('Error fetching logs:', err);
        return [];
    }
}

export { pool };
