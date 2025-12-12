
import psycopg2
import os
import json
from datetime import datetime

# Production DB URL (Hardcoded for checking)
DB_URL = "postgresql://postgres.urqbpbbomdpejbxhlgqq:gd3yF6HR9cK6@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"

def check_status():
    try:
        print("🔌 Connecting to Database...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        # 1. Check Heartbeats (if table exists)
        try:
            print("\n💓 Checking Heartbeats...")
            cur.execute("SELECT agent_name, status, last_active, metadata FROM agent_heartbeats ORDER BY last_active DESC LIMIT 5")
            rows = cur.fetchall()
            if rows:
                print(f"{'AGENT':<20} | {'STATUS':<10} | {'LAST ACTIVE':<25}")
                print("-" * 60)
                for r in rows:
                    print(f"{r[0]:<20} | {r[1]:<10} | {r[2]}")
            else:
                print("No heatbeats found.")
        except Exception as e:
            print(f"Skipping Heartbeats: {e}")
            conn.rollback()

        # 2. Check Recent Jobs
        try:
            print("\n📋 Checking Recent Agent Jobs...")
            cur.execute("SELECT id, command, status, created_at, updated_at, result FROM agent_jobs ORDER BY created_at DESC LIMIT 5")
            rows = cur.fetchall()
            if rows:
                print(f"{'ID':<5} | {'STATUS':<10} | {'CREATED':<20} | {'COMMAND':<40}")
                print("-" * 100)
                for r in rows:
                    cmd_short = (r[1][:37] + '...') if len(r[1]) > 37 else r[1]
                    print(f"{r[0]:<5} | {r[2]:<10} | {str(r[3])[:19]:<20} | {cmd_short:<40}")
            else:
                print("No jobs found.")
        except Exception as e:
            print(f"Skipping Jobs: {e}")

        conn.close()

    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    check_status()
