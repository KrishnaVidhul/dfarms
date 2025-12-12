
import os
import sys
import psycopg2
from dotenv import load_dotenv

# Load Environment from .env or system
load_dotenv()
DB_URL = os.environ.get("DATABASE_URL")

if not DB_URL:
    print("❌ Error: DATABASE_URL not set.")
    sys.exit(1)

DDL_STATEMENTS = [
    # 1. Development Cycles (The "Feature Ticket")
    """
    CREATE TABLE IF NOT EXISTS development_cycles (
        id SERIAL PRIMARY KEY, -- Use Serial for simplicity, or UUID if preferred
        feature_title TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('PROPOSING', 'ITERATING', 'APPROVED', 'DEPLOYED')),
        iteration_count INT DEFAULT 0,
        current_context TEXT, -- The actual code or plan being iterated on
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 2. Agent Consensus Logs (The "Votes")
    """
    CREATE TABLE IF NOT EXISTS agent_consensus_logs (
        id SERIAL PRIMARY KEY,
        cycle_id INT REFERENCES development_cycles(id) ON DELETE CASCADE,
        agent_role TEXT NOT NULL, -- e.g., 'Product Owner', 'Dev', 'QA'
        iteration_number INT NOT NULL,
        feedback TEXT,
        vote BOOLEAN, -- TRUE = Approve, FALSE = Reject/Needs Work
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
]

def apply_schema():
    print(f"🔌 Connecting to Database...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        print("🛠️  Applying Schema Updates...")
        for ddl in DDL_STATEMENTS:
            cur.execute(ddl)
            
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Schema Upgrade Applied Successfully!")
        
    except Exception as e:
        print(f"❌ Migration Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    apply_schema()
