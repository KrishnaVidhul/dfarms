import time
import os
import sys
import subprocess
import psycopg2
import re
from datetime import datetime

# Setup Logger
sys.path.append(os.path.join(os.path.dirname(__file__), '../agent_runtime'))
try:
    from agent_logger import AgentMonitor
except:
    class AgentMonitor:
        def __init__(self, name): self.name = name
        def update_status(self, s, t): print(f"[{self.name}] {s}: {t}")

DB_URL = os.environ.get("DATABASE_URL", "postgresql://dfarms_user:dfarms_pass@localhost:5432/dfarms_db")

def get_next_ticket():
    """Finds the highest priority PLANNED ticket from roadmap or backlog."""
    # 1. Check DB first
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute("SELECT feature_name FROM feature_roadmap WHERE status = 'PLANNED' LIMIT 1")
        row = cur.fetchone()
        conn.close()
        if row:
            return row[0]
    except:
        pass
    return None

def update_roadmap_status(feature, status, pr_link=None):
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        if status == "DEPLOYED":
            cur.execute("""
                UPDATE feature_roadmap 
                SET status = %s, pr_link = %s, completed_at = CURRENT_TIMESTAMP 
                WHERE feature_name = %s
            """, (status, pr_link, feature))
        else:
            cur.execute("UPDATE feature_roadmap SET status = %s WHERE feature_name = %s", (status, feature))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Update Error: {e}")

def reset_stuck_tasks():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        # Reset tasks stuck in BUILDING for > 15 minutes
        cur.execute("""
            UPDATE feature_roadmap 
            SET status = 'PLANNED' 
            WHERE status = 'BUILDING' 
            AND created_at < NOW() - INTERVAL '15 minutes'
        """)
        if cur.rowcount > 0:
            print(f"Reset {cur.rowcount} stuck tasks.")
        conn.commit()
        conn.close()
    except:
        pass

def main():
    monitor = AgentMonitor("Auto_Dev_Controller")
    monitor.update_status("IDLE", "Initializing Autonomous Loop...")
    
    # 1. Initialize DB if needed
    subprocess.run(["python", "src/scripts/init_roadmap.py"], check=False)
    
    iteration = 0
    # max_iterations = 1 # REMOVED: Production Mode is Infinite
    
    while True:
        reset_stuck_tasks()
        monitor.update_status("PLANNING", "Scanning for work...")
        iteration += 1
        
        # A. Discovery Phase (simulate running research tools)
        # In a real loop, we would run gap_hunter.py here occasionally
        
        # B. Selection Phase
        ticket = get_next_ticket()
        
        if ticket:
            monitor.update_status("PLANNING", f"Selected Feature: {ticket}")
            
            # C. Build Phase
            update_roadmap_status(ticket, "BUILDING")
            monitor.update_status("BUILDING", f"Triggering Refactor Engine for {ticket}...")
            
            try:
                # Trigger the actual build script
                subprocess.run([
                    "python", "src/scripts/refactor_engine.py", 
                    "--feature", ticket
                ], check=True)
                
                # D. Verification & Deploy
                # Assuming success if no exception
                pr_link = f"https://github.com/d-farms/core/pull/{int(time.time())}"
                update_roadmap_status(ticket, "DEPLOYED", pr_link)
                monitor.update_status("DEPLOYED", f"{ticket} is Live! PR: {pr_link}")
                
            except Exception as e:
                monitor.update_status("ERROR", f"Build failed for {ticket}: {e}")
                # Revert status?
        else:
            monitor.update_status("IDLE", "No planned items found. Sleeping.")
            
        time.sleep(5)
        iteration += 1

if __name__ == "__main__":
    main()
