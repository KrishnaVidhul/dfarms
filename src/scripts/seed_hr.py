import os
import psycopg2
from psycopg2.extras import RealDictCursor

DB_URL = os.environ.get("DATABASE_URL")

def seed_hr():
    print("🌱 Seeding HR Module...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        # 1. Employees Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL,
                department TEXT NOT NULL,
                status TEXT DEFAULT 'Active',
                join_date DATE DEFAULT CURRENT_DATE,
                salary_per_month NUMERIC(10, 2)
            );
        """)

        # 2. Payroll Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS payroll_runs (
                id SERIAL PRIMARY KEY,
                run_date DATE DEFAULT CURRENT_DATE,
                total_amount NUMERIC(12, 2),
                status TEXT DEFAULT 'Processed',
                notes TEXT
            );
        """)

        # 3. Seed Data
        # Check if empty
        cur.execute("SELECT COUNT(*) FROM employees")
        if cur.fetchone()[0] == 0:
            employees = [
                ("Ramesh Gupta", "Farm Manager", "Operations", 45000),
                ("Suresh Kumar", "Senior Agronomist", "R&D", 60000),
                ("Anita Desai", "Logistics Coordinator", "Logistics", 35000),
                ("Michael Scott", "Regional Manager", "Sales", 80000),
            ]
            cur.executemany("""
                INSERT INTO employees (full_name, role, department, salary_per_month)
                VALUES (%s, %s, %s, %s)
            """, employees)
            print("✅ Added initial employees.")
        else:
            print("ℹ️ Employees table already populated.")

        conn.commit()
        conn.close()
        print("✅ HR Module Database Ready.")

    except Exception as e:
        print(f"❌ HR Seed Failed: {e}")

if __name__ == "__main__":
    seed_hr()
