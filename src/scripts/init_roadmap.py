
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.environ.get("DATABASE_URL", "postgresql://dfarms_user:dfarms_pass@localhost:5432/dfarms_db")

def init_roadmap_db():
    print("🚦 Initializing Feature Roadmap Database...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS feature_roadmap (
                id SERIAL PRIMARY KEY,
                feature_name TEXT NOT NULL UNIQUE,
                source TEXT NOT NULL, -- 'R&D', 'Gap Hunter', 'User Request'
                status TEXT NOT NULL DEFAULT 'PLANNED', -- 'PLANNED', 'BUILDING', 'DEPLOYED'
                pr_link TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
        """)
        
        # Seed some initial data if empty
        cur.execute("SELECT COUNT(*) FROM feature_roadmap")
        if cur.fetchone()[0] == 0:
            print("🌱 Seeding initial roadmap items...")
            cur.execute("""
                INSERT INTO feature_roadmap (feature_name, source, status) VALUES 
                ('Voice-First Navigation', 'R&D', 'PLANNED'),
                ('Automated Invoice OCR', 'Gap Hunter', 'PLANNED'),
                ('Driver PWA', 'User Request', 'DEPLOYED')
            """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Roadmap Table Ready.")
    except Exception as e:
        print(f"❌ DB Init Failed: {e}")

if __name__ == "__main__":
    init_roadmap_db()
