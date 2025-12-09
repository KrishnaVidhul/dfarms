
import os
import psycopg2
from datetime import datetime, timedelta

def migrate_db():
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        
        # 1. Add expiry_date column if it doesn't exist
        print("Checking/Adding expiry_date column...")
        try:
            cur.execute("ALTER TABLE inventory ADD COLUMN expiry_date DATE;")
            conn.commit()
            print("Column 'expiry_date' added.")
        except psycopg2.errors.DuplicateColumn:
            conn.rollback()
            print("Column 'expiry_date' already exists.")
            
        # 2. Seed Mock Expiry Dates
        print("Seeding Expiry Data...")
        
        # High Risk Item (Expiring in 5 days)
        cur.execute("""
            UPDATE inventory 
            SET expiry_date = CURRENT_DATE + INTERVAL '5 days', status = 'Expiring Soon'
            WHERE pulse_type ILIKE '%Chana%'
        """)
        
        # Safe Item (Expiring in 90 days)
        cur.execute("""
            UPDATE inventory 
            SET expiry_date = CURRENT_DATE + INTERVAL '90 days'
            WHERE pulse_type NOT ILIKE '%Chana%'
        """)
        
        conn.commit()
        print("Migration & Seeding Complete.")
        
        # Verify
        cur.execute("SELECT pulse_type, weight_kg, expiry_date FROM inventory")
        rows = cur.fetchall()
        for r in rows:
            print(f"- {r[0]}: {r[1]}kg (Expires: {r[2]})")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"Migration Error: {e}")

if __name__ == "__main__":
    migrate_db()
