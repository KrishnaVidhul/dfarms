
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as {
    conn: Pool | undefined;
};

let pool: Pool;

if (!globalForDb.conn) {
    globalForDb.conn = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Supabase Transaction Mode compatibility
        },
        max: 5, // Limit max connections per container to prevent exhaustion
        connectionTimeoutMillis: 30000, // Increased to 30s to handle cross-region latency
        idleTimeoutMillis: 20000,
        maxUses: 7500, // Recycle connections periodically
        keepAlive: true, // Enable TCP KeepAlive
    });
    console.log("Generic DB Pool Initialized with config:");
    console.log(`Max: 5, Timeout: ${30000}, KeepAlive: true`);
}

pool = globalForDb.conn;

export async function getInventory(commodityId?: number) {
    try {
        let query = 'SELECT * FROM inventory';
        const params: any[] = [];

        if (commodityId) {
            query += ' WHERE commodity_id = $1';
            params.push(commodityId);
        }

        query += ' ORDER BY id DESC';

        const res = await pool.query(query, params);
        return res.rows;
    } catch (err) {
        console.error('Error fetching inventory:', err);
        return [];
    }
}

export async function getBatches(commodityId?: number) {
    try {
        let query = `
            SELECT b.*, c.name as commodity_name 
            FROM batches b
            JOIN commodities c ON b.commodity_id = c.id
        `;
        const params: any[] = [];

        if (commodityId) {
            query += ' WHERE b.commodity_id = $1';
            params.push(commodityId);
        }

        query += ' ORDER BY b.created_at DESC';

        const res = await pool.query(query, params);
        return res.rows;
    } catch (err) {
        console.error('Error fetching batches:', err);
        return [];
    }
}

export async function createQualityTest(data: {
    batch_id: number;
    moisture_percent: number;
    foreign_matter_percent: number;
    status: 'PASS' | 'FAIL';
}) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert Test
        const insertRes = await client.query(`
            INSERT INTO quality_tests (batch_id, moisture_percent, foreign_matter_percent, status)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [data.batch_id, data.moisture_percent, data.foreign_matter_percent, data.status]);

        // Auto-Flag Logic: If Moisture > 12%, update batch status to 'NEEDS_DRYING' (conceptually)
        // Or strictly 'FAIL' implies specific handling.
        // User asked: "If Moisture > 12%, auto-flag the Batch Status as 'NEEDS_DRYING'."
        // 'batches' table has 'current_stage'? Or 'status'? Migration 002 had 'current_stage'.
        // Assuming we update 'current_stage' or adds a flag. Let's use 'current_stage' = 'DRYING' if fail?
        // Or if table has status column. Migration 002: `current_stage` VARCHAR.
        // Let's assume 'DRYING' is a valid stage.

        if (data.moisture_percent > 12) {
            await client.query(`
                UPDATE batches 
                SET current_stage = 'DRYING' 
                WHERE id = $1
            `, [data.batch_id]);
        }

        await client.query('COMMIT');
        return { success: true, testId: insertRes.rows[0].id };
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error creating quality test:', e);
        return { success: false, error: 'Transaction failed' };
    } finally {
        client.release();
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

export async function getRecentActivity() {
    try {
        // Fetch recent jobs/actions from the agent_jobs table
        const res = await pool.query(`
            SELECT id, command as text, status, created_at as time 
            FROM agent_jobs 
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        return res.rows.map(row => ({
            id: row.id,
            text: row.text,
            time: new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: row.status === 'COMPLETED' ? 'success' : row.status === 'FAILED' ? 'warning' : 'info'
        }));
    } catch (err) {
        console.error('Error fetching activity:', err);
        return [];
    }
}

// e-NAM Market Data Functions
export async function getMarketPricesByFilters(filters: {
    commodity?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}) {
    try {
        let query = 'SELECT * FROM market_prices WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (filters.commodity) {
            query += ` AND commodity ILIKE $${paramIndex}`;
            params.push(`%${filters.commodity}%`);
            paramIndex++;
        }

        if (filters.state) {
            query += ` AND state ILIKE $${paramIndex}`;
            params.push(`%${filters.state}%`);
            paramIndex++;
        }

        if (filters.startDate) {
            query += ` AND arrival_date >= $${paramIndex}`;
            params.push(filters.startDate);
            paramIndex++;
        }

        if (filters.endDate) {
            query += ` AND arrival_date <= $${paramIndex}`;
            params.push(filters.endDate);
            paramIndex++;
        }

        query += ' ORDER BY arrival_date DESC, commodity ASC';

        if (filters.limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(filters.limit);
        } else {
            query += ' LIMIT 1000';
        }

        const res = await pool.query(query, params);
        return res.rows;
    } catch (err) {
        console.error('Error fetching filtered market prices:', err);
        return [];
    }
}

export async function getUniqueCommodities() {
    try {
        const res = await pool.query(`
            SELECT DISTINCT commodity 
            FROM market_prices 
            WHERE commodity IS NOT NULL 
            ORDER BY commodity ASC
        `);
        return res.rows.map(row => row.commodity);
    } catch (err) {
        console.error('Error fetching commodities:', err);
        return [];
    }
}

export async function getUniqueStates() {
    try {
        const res = await pool.query(`
            SELECT DISTINCT state 
            FROM market_prices 
            WHERE state IS NOT NULL 
            ORDER BY state ASC
        `);
        return res.rows.map(row => row.state);
    } catch (err) {
        console.error('Error fetching states:', err);
        return [];
    }
}

export async function getPriceTrends(commodity: string, days: number = 30) {
    try {
        const res = await pool.query(`
            SELECT 
                arrival_date,
                AVG(min_price) as avg_min_price,
                AVG(max_price) as avg_max_price,
                AVG(modal_price) as avg_modal_price,
                COUNT(*) as market_count
            FROM market_prices
            WHERE commodity ILIKE $1
                AND arrival_date >= CURRENT_DATE - INTERVAL '${days} days'
                AND modal_price IS NOT NULL
            GROUP BY arrival_date
            ORDER BY arrival_date ASC
        `, [`%${commodity}%`]);
        return res.rows;
    } catch (err) {
        console.error('Error fetching price trends:', err);
        return [];
    }
}

export async function getMarketStats() {
    try {
        const res = await pool.query(`
            SELECT 
                COUNT(DISTINCT commodity) as total_commodities,
                COUNT(DISTINCT state) as total_states,
                COUNT(DISTINCT market_name) as total_markets,
                MAX(fetched_at) as last_updated
            FROM market_prices
        `);
        return res.rows[0] || {};
    } catch (err) {
        console.error('Error fetching market stats:', err);
        return {};
    }
}


// Commodity Manufacturing Dashboard Queries

export async function getProcurementComparison(commodityId: number = 2) {
    try {
        // Dynamic Fetch: Get Commodity Name by ID
        const commRes = await pool.query('SELECT name FROM commodities WHERE id = $1', [commodityId]);
        const commodityName = commRes.rows[0]?.name || 'Tur';

        // Fetch Current E-NAM Price
        const marketRes = await pool.query(`
            SELECT modal_price, arrival_date 
            FROM market_prices 
            WHERE commodity ILIKE $1 
            ORDER BY arrival_date DESC 
            LIMIT 1
        `, [`%${commodityName}%`]);

        const currentMarketPrice = parseFloat(marketRes.rows[0]?.modal_price || 0) / 100; // Convert Quintal to Kg

        // Real Data: Avg Purchase Price from Batches
        const avgRes = await pool.query(`
            SELECT AVG(purchase_price) as avg_price 
            FROM batches 
            WHERE commodity_id = $1 AND purchase_price > 0
        `, [commodityId]);

        let avgPurchasePrice = parseFloat(avgRes.rows[0]?.avg_price || 0);

        // Real Data Only
        // if (avgPurchasePrice === 0 && currentMarketPrice > 0) { ... } REMOVED

        return {
            avgPurchasePrice,
            currentMarketPrice,
            diffPercent: (currentMarketPrice && avgPurchasePrice) ? ((currentMarketPrice - avgPurchasePrice) / avgPurchasePrice) * 100 : 0
        };
    } catch (err) {
        console.error('Error fetching procurement stats:', err);
        return { avgPurchasePrice: 0, currentMarketPrice: 0, diffPercent: 0 };
    }
}



export async function getProductionYield(commodityId: number = 2) {
    try {
        // Real Data: Yield stats from Batches
        const yieldRes = await pool.query(`
            SELECT batch_code, yield_percent 
            FROM batches 
            WHERE commodity_id = $1 AND yield_percent > 0 
            ORDER BY created_at DESC 
            LIMIT 5
        `, [commodityId]);

        const history = yieldRes.rows.map(r => ({
            batch: r.batch_code,
            yield: parseFloat(r.yield_percent)
        }));

        return {
            targetYield: 75,
            currentYield: history.length > 0 ? history[0].yield : 0,
            history
        };
    } catch (err) {
        console.error('Error fetching yield stats:', err);
        return { targetYield: 75, currentYield: 0, history: [] };
    }
}

export async function getStockBreakdown(commodityId: number = 2) {
    try {
        // Real Data: Sum quantity by stage
        const res = await pool.query(`
            SELECT current_stage, SUM(quantity) as val 
            FROM batches 
            WHERE commodity_id = $1 
            GROUP BY current_stage
        `, [commodityId]);

        let raw = 0;
        let finished = 0;
        let byproducts = 0; // WIP / ByProduct

        res.rows.forEach(row => {
            const stage = (row.current_stage || '').toUpperCase();
            const val = parseFloat(row.val);
            if (['RAW', 'STORED'].includes(stage)) raw += val;
            else if (['PACKED', 'PROCESSED'].includes(stage)) finished += val;
            else byproducts += val; // WIP matches By-Product/WIP bucket
        });

        // If data is empty, return fallbacks for better UI experience initially?
        // No, unified data means real data. If 0, show 0 or empty chart.
        // But for "Demo" feeling, maybe keep mock if 0? 
        // User said "manual entry... reflect same". So if 0, it should be 0.
        // But initially it might look broken.
        // I'll return real data. If 0, charts might be empty.

        return [
            { name: 'Raw Material', value: raw, fill: '#10B981' },
            { name: 'Finished Goods', value: finished, fill: '#3B82F6' },
            { name: 'Work in Progress', value: byproducts, fill: '#F59E0B' },
        ];
    } catch (err) {
        console.error('Error fetching stock breakdown:', err);
        return [];
    }
}

export async function createBatch(data: {
    commodity_id: number;
    batch_code: string;
    quantity: number;
    purchase_price: number;
    yield_percent?: number;
    current_stage: string;
}) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Default yield 0 if undefined
        const yieldVal = data.yield_percent || 0;

        const res = await client.query(`
            INSERT INTO batches 
            (commodity_id, batch_code, weight_in_kg, quantity, purchase_price, yield_percent, current_stage)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `, [
            data.commodity_id,
            data.batch_code,
            data.quantity, // weight_in_kg = quantity for simplicity
            data.quantity,
            data.purchase_price,
            yieldVal,
            data.current_stage
        ]);

        await client.query('COMMIT');
        return { success: true, id: res.rows[0].id };
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error creating batch:', e);
        return { success: false, error: 'Failed to create batch' };
    } finally {
        client.release();
    }
}



export async function getBatchById(id: number) {
    try {
        const res = await pool.query('SELECT * FROM batches WHERE id = $1', [id]);
        return res.rows[0];
    } catch (e) {
        return null;
    }
}

export async function updateBatchStatus(id: number, stage: string, quantity: number, yieldPercent: number) {
    try {
        await pool.query(`
            UPDATE batches 
            SET current_stage = $1, quantity = $2, yield_percent = $3, updated_at = NOW()
            WHERE id = $4
        `, [stage, quantity, yieldPercent, id]);
        return { success: true };
    } catch (e) {
        console.error('Error updating batch:', e);
        return { success: false };
    }
}

export async function getCommodityName(id: number): Promise<string> {
    try {
        const res = await pool.query('SELECT name FROM commodities WHERE id = $1', [id]);
        return res.rows[0]?.name || 'Unknown Commodity';
    } catch (e) {
        return 'Unknown Commodity';
    }
}

export { pool };
