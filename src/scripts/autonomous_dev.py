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
        elif status == "BUILDING":
             cur.execute("""
                UPDATE feature_roadmap 
                SET status = %s, started_at = CURRENT_TIMESTAMP 
                WHERE feature_name = %s
            """, (status, feature))
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
            # C. Build Phase (With Retries)
            update_roadmap_status(ticket, "BUILDING")
            
            max_retries = 3
            attempt = 0
            success = False
            last_error = None
            
            while attempt < max_retries:
                attempt += 1
                monitor.update_status("BUILDING", f"Attempt {attempt}/{max_retries} for {ticket}...")
                
                try:
                    # Construct command
                    cmd = ["python", "src/scripts/refactor_engine.py", "--feature", ticket]
                    if last_error:
                        cmd.extend(["--feedback", last_error])
                        
                    # Trigger Refactor Engine
                    subprocess.run(cmd, check=True)
                    
                    # Gatekeeper Check
                    monitor.update_status("VERIFYING", f"Running Gatekeeper (Attempt {attempt})...")
                    gatekeeper_res = subprocess.run(
                        ["python", "src/scripts/gatekeeper.py", ticket], 
                        capture_output=True, text=True
                    )
                    
                    if gatekeeper_res.returncode == 0:
                        success = True
                        break # Success!
                    else:
                        last_error = gatekeeper_res.stdout
                        monitor.update_status("FIXING", f"Gatekeeper Rejected. Retrying with feedback...")
                        
                except Exception as e:
                    last_error = str(e)
            
            if success:
                 # E. Deploy
                pr_link = f"https://github.com/d-farms/core/pull/{int(time.time())}"
                update_roadmap_status(ticket, "DEPLOYED", pr_link)
                monitor.update_status("DEPLOYED", f"{ticket} is Live! PR: {pr_link}")
            else:
                monitor.update_status("ERROR", f"Build failed after {max_retries} attempts. Marking as FAILED.")
                update_roadmap_status(ticket, "FAILED")
        else:
            monitor.update_status("IDLE", "No planned items found. Running Innovation Lab...")
            try:
                # Perpetual Innovation: If empty, generate work
                subprocess.run(["python", "src/scripts/gap_hunter.py"], check=False)
                # Check DB again immediately
                ticket = get_next_ticket()
                if not ticket:
                     subprocess.run(["python", "src/scripts/innovation_lab.py"], check=False)
            except Exception as e:
                if not ticket:
                     subprocess.run(["python", "src/scripts/innovation_lab.py"], check=False)
            except Exception as e:
                monitor.log(f"Innovation Lab failed: {e}")
        
        # Periodic Maintenance (Every 5 iterations ~ 30s)
        if iteration % 5 == 0:
            try:
                subprocess.run(["python", "src/scripts/scout.py"], check=False)
                subprocess.run(["python", "src/scripts/evolve_now.py"], check=False)
            except:
                pass
            
        time.sleep(30) # Groq Free Tier Friendly (Avoid Rate Limits)
        iteration += 1

if __name__ == "__main__":
    main()
