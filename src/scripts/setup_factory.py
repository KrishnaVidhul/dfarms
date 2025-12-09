
import os
import sys
import argparse
import psycopg2
import hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load Environment
load_dotenv()
DB_URL = os.environ.get("DATABASE_URL", "postgresql://dfarms_user:dfarms_pass@localhost:5432/dfarms_db")

# ---- DATA Definitions ----

DDL_STATEMENTS = [
    # 0. Extensions
    "CREATE EXTENSION IF NOT EXISTS vector;",

    # 0.5 Corporate Memory (Knowledge Base)
    """
    CREATE TABLE IF NOT EXISTS corporate_memory (
        id SERIAL PRIMARY KEY,
        content_text TEXT NOT NULL,
        embedding vector(1536), -- 1536 dimensions for OpenAI/Ollama embeddings
        file_path TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 1. Inventory
    """
    CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        batch_id TEXT UNIQUE NOT NULL,
        pulse_type TEXT NOT NULL,
        grade TEXT NOT NULL,
        weight_kg DECIMAL(10, 2) NOT NULL,
        status TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 2. Auth (Users)
    """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL, -- 'super_admin', 'staff', 'customer'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 3. Market Prices
    """
    CREATE TABLE IF NOT EXISTS market_prices (
        id SERIAL PRIMARY KEY,
        pulse_type TEXT NOT NULL,
        location TEXT NOT NULL,
        price TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 4. Production
    """
    CREATE TABLE IF NOT EXISTS production_runs (
        id SERIAL PRIMARY KEY,
        input_batch_id TEXT NOT NULL,
        output_pulse_type TEXT NOT NULL,
        input_weight DECIMAL(10, 2) NOT NULL,
        yield_weight DECIMAL(10, 2) NOT NULL,
        waste_weight DECIMAL(10, 2) NOT NULL,
        efficiency_percent DECIMAL(5, 2) NOT NULL,
        run_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 5. Finance
    """
    CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) CHECK (type IN ('INCOME', 'EXPENSE')),
        category VARCHAR(50), 
        amount DECIMAL(12, 2) NOT NULL,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(100),
        items_json JSONB,
        tax_amount DECIMAL(10, 2),
        total_amount DECIMAL(12, 2),
        pdf_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 6. Observability
    """
    CREATE TABLE IF NOT EXISTS agent_heartbeats (
        agent_name TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        current_thought TEXT,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS agent_logs (
        id SERIAL PRIMARY KEY,
        agent_name TEXT NOT NULL,
        log_message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 7. Business (CRM & Compliance)
    """
    CREATE TABLE IF NOT EXISTS crm_leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact_info TEXT,
        status VARCHAR(50) DEFAULT 'New', -- New, Negotiating, Closed-Won, Lost
        notes TEXT,
        last_contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS compliance_tracker (
        id SERIAL PRIMARY KEY,
        license_name VARCHAR(100) NOT NULL,
        expiry_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 8. Quality Control (Added from checklist reference)
    """
    CREATE TABLE IF NOT EXISTS quality_checks (
        id SERIAL PRIMARY KEY,
        image_path TEXT NOT NULL,
        analysis_result TEXT,
        grade TEXT,
        confidence REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
]

# ---- Helper Functions ----

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def drop_all_tables(cur):
    print("⚠️  WARNING: DROPPING ALL TABLES...")
    tables = [
        "inventory", "users", "market_prices", "production_runs", 
        "transactions", "invoices", "agent_heartbeats", "agent_logs",
        "crm_leads", "compliance_tracker", "quality_checks"
    ]
    for table in tables:
        cur.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
    print("✅ All tables dropped.")

def create_tables(cur):
    print("🏗️  Creating Database Schema...")
    for ddl in DDL_STATEMENTS:
        cur.execute(ddl)
    print("✅ Schema created.")

def seed_data(cur):
    print("🌱 Seeding Initial Data...")

    # 1. Inventory
    inventory = [
        ("BATCH-2025-001", "Chana", "Raw", 500.00, "Raw"),
        ("BATCH-2025-002", "Toor Dal", "A", 200.00, "Packaged"),
        ("BATCH-2025-003", "Moong", "Raw", 1000.00, "Processing")
    ]
    for batch in inventory:
        cur.execute("""
            INSERT INTO inventory (batch_id, pulse_type, grade, weight_kg, status)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (batch_id) DO NOTHING;
        """, batch)

    # 2. Users (@admin / @staff / @driver)
    users = [
        ("admin", "admin123", "super_admin"),
        ("staff", "staff123", "staff"),
        ("driver1", "driver123", "driver")
    ]
    for username, password, role in users:
        phash = hash_password(password)
        cur.execute("""
            INSERT INTO users (username, password_hash, role)
            VALUES (%s, %s, %s)
            ON CONFLICT (username) DO NOTHING;
        """, (username, phash, role))

    # 3. Finance (Expenses)
    cur.execute("SELECT COUNT(*) FROM transactions")
    if cur.fetchone()[0] == 0:
        cur.execute("""
            INSERT INTO transactions (type, category, amount, description) VALUES
            ('EXPENSE', 'PROCUREMENT', 45000.00, 'Bulk purchase of Raw Tur Dal (500kg)'),
            ('EXPENSE', 'OPS', 1200.00, 'Utility Bill - Electricity'),
            ('EXPENSE', 'OPS', 5000.00, 'Machinery Maintenance')
        """)

    # 4. Agents
    agents = ["Refactor_Engine", "Scout", "Evolution_Manager"]
    for agent in agents:
        cur.execute("""
            INSERT INTO agent_heartbeats (agent_name, status, current_thought, last_active)
            VALUES (%s, 'IDLE', 'System Rebooted', CURRENT_TIMESTAMP)
            ON CONFLICT (agent_name) DO NOTHING;
        """, (agent,))

    # 5. CRM Leads
    cur.execute("SELECT COUNT(*) FROM crm_leads")
    if cur.fetchone()[0] == 0:
        cur.execute("""
            INSERT INTO crm_leads (name, contact_info, status, notes) VALUES
            ('Big Basket Procurement', 'procurement@bigbasket.com', 'Negotiating', 'Interested in 500kg monthly supply of Organic Tur Dal.'),
            ('Hotel Taj Kitchens', 'chef.rajiv@taj.com', 'New', 'Inquired about bulk rates for Moong Dal.'),
            ('Local Kirana Association', 'contact@kirana.org', 'Lost', 'Price too high compared to competitors.')
        """)

    # 6. Compliance
    cur.execute("SELECT COUNT(*) FROM compliance_tracker")
    if cur.fetchone()[0] == 0:
        soon = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')
        future = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
        cur.execute("""
            INSERT INTO compliance_tracker (license_name, expiry_date, status) VALUES
            ('FSSAI License Renewal', %s, 'Expiring Soon'),
            ('GST Annual Filing', %s, 'Active')
        """, (soon, future))

    print("✅ Data seeding complete.")

# ---- Main Execution ----

def main():
    parser = argparse.ArgumentParser(description="D Farms Factory Setup Tool")
    parser.add_argument("--reset", action="store_true", help="DANGEROUS: Drop all tables and restart.")
    args = parser.parse_args()

    if args.reset:
        confirm = input("💥 ARE YOU SURE you want to DELETE ALL DATA? Type 'DELETE' to confirm: ")
        if confirm != "DELETE":
            print("Reset aborted.")
            return

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        if args.reset:
            drop_all_tables(cur)

        create_tables(cur)
        seed_data(cur)

        conn.commit()
        cur.close()
        conn.close()
        print("\n🚀 D Farms Factory Environment Setup Successfully!")

    except Exception as e:
        print(f"\n❌ Setup Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
