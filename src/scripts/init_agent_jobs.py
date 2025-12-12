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
    """
    CREATE TABLE IF NOT EXISTS agent_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        command TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
        result TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
]

def apply_schema():
    print(f"🔌 Connecting to Database...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        print("🛠️  Applying Schema Updates for Agent Jobs...")
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
