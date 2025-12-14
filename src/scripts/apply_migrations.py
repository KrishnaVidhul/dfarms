#!/usr/bin/env python3
"""
Robust Database Migration Runner
Applies SQL migration files from src/scripts/migrations/ in order.
Tracks applied migrations to ensure idempotency.
"""

import os
import sys
import psycopg2
import glob

DB_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    if not DB_URL:
        print("❌ ERROR: DATABASE_URL not set")
        sys.exit(1)
    return psycopg2.connect(DB_URL)

def init_migration_history(cursor):
    """Create migrations table if it doesn't exist"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS migrations_history (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) UNIQUE NOT NULL,
            applied_at TIMESTAMP DEFAULT NOW()
        );
    """)

def get_applied_migrations(cursor):
    """Get list of already applied migrations"""
    cursor.execute("SELECT filename FROM migrations_history")
    return {row[0] for row in cursor.fetchall()}

def apply_migration(conn, cursor, filepath):
    """Apply a single migration file"""
    filename = os.path.basename(filepath)
    print(f"🔄 Applying {filename}...")

    try:
        with open(filepath, 'r') as f:
            sql = f.read()

        cursor.execute(sql)
        cursor.execute("INSERT INTO migrations_history (filename) VALUES (%s)", (filename,))
        conn.commit()
        print(f"✅ Applied {filename}")
        return True
    except Exception as e:
        print(f"❌ Error applying {filename}: {e}")
        conn.rollback()
        return False

def main():
    print("="*60)
    print("🐘 D-Farms Database Migrator")
    print("="*60)

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Init History
    init_migration_history(cursor)
    conn.commit()

    # 2. Get Pending Migrations
    applied = get_applied_migrations(cursor)
    migration_dir = os.path.join(os.path.dirname(__file__), 'migrations')

    # Get all .sql files and sort them
    files = sorted(glob.glob(os.path.join(migration_dir, '*.sql')))

    pending_count = 0
    for filepath in files:
        filename = os.path.basename(filepath)
        if filename not in applied:
            success = apply_migration(conn, cursor, filepath)
            if not success:
                print("🛑 Migration failed. Stopping.")
                sys.exit(1)
            pending_count += 1
        else:
            print(f"⏭️  Skipping {filename} (already applied)")

    if pending_count == 0:
        print("\n✨ Database is up to date!")
    else:
        print(f"\n🚀 Successfully applied {pending_count} migrations.")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
