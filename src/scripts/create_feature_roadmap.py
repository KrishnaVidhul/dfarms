
import psycopg2
import os

# Production DB URL
DB_URL = "postgresql://postgres.urqbpbbomdpejbxhlgqq:gd3yF6HR9cK6@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"

DDL = """
CREATE TABLE IF NOT EXISTS feature_roadmap (
    id SERIAL PRIMARY KEY,
    feature_name TEXT NOT NULL,
    source TEXT DEFAULT 'Manual',
    status TEXT NOT NULL CHECK (status IN ('PLANNED', 'Discovery', 'BUILDING', 'DEPLOYED', 'APPROVED')),
    pr_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial data if empty
INSERT INTO feature_roadmap (feature_name, source, status, created_at)
SELECT 'Autonomous Agent Integration', 'System', 'DEPLOYED', NOW()
WHERE NOT EXISTS (SELECT 1 FROM feature_roadmap);

INSERT INTO feature_roadmap (feature_name, source, status, created_at)
SELECT 'Advanced Analytics Dashboard', 'Product Owner', 'PLANNED', NOW()
WHERE NOT EXISTS (SELECT 1 FROM feature_roadmap WHERE feature_name = 'Advanced Analytics Dashboard');
"""

def apply_migration():
    try:
        print("Connecting to DB...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("Creating table feature_roadmap...")
        cur.execute(DDL)
        conn.commit()
        print("Table created and seeded successfully.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Migration Failed: {e}")

if __name__ == "__main__":
    apply_migration()
