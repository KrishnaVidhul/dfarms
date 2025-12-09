import time
import os
import sys
import subprocess
import psycopg2
from datetime import datetime

# Setup Logger
sys.path.append(os.path.join(os.path.dirname(__file__), '../agent_runtime'))
try:
    from agent_logger import AgentMonitor
except:
    class AgentMonitor:
        def __init__(self, name): self.name = name
        def update_status(self, s, t): print(f"[{self.name}] {s}: {t}")

def check_process_running(process_name):
    """Check if there is any running process that contains the given name process_name."""
    try:
        # Use pgrep to find process IDs
        output = subprocess.check_output(["pgrep", "-f", process_name])
        return True
    except subprocess.CalledProcessError:
        return False

def restart_agent(agent_script, monitor):
    monitor.update_status("HEALING", f"Detected {agent_script} is dead. Restarting...")
    # Run in background detached
    subprocess.Popen(["python", f"src/scripts/{agent_script}"])
    monitor.update_status("HEALING", f"Restarted {agent_script}.")

def fix_stuck_db_tasks(monitor):
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        # Reset tasks stuck in BUILDING for > 20 minutes
        cur.execute("""
            UPDATE feature_roadmap 
            SET status = 'PLANNED' 
            WHERE status = 'BUILDING' 
            AND started_at < NOW() - INTERVAL '20 minutes'
        """)
        if cur.rowcount > 0:
            monitor.update_status("HEALING", f"Reset {cur.rowcount} stuck tasks to PLANNED.")
        conn.commit()
        conn.close()
    except Exception as e:
        monitor.log(f"DB Monitor Error: {e}")

def main():
    monitor = AgentMonitor("The_Overseer")
    monitor.update_status("WATCHING", "Initializing System Supervision...")
    
    agents_to_watch = ["autonomous_dev.py"]

    while True:
        # 1. Check Processes
        for agent in agents_to_watch:
            if not check_process_running(agent):
                restart_agent(agent, monitor)
            else:
                # Occasional heartbeat log?
                pass

        # 2. Check Logic/DB Timeouts
        fix_stuck_db_tasks(monitor)
        
        # 3. Report Health
        monitor.update_status("WATCHING", "All systems nominal.")
        
        time.sleep(10)

if __name__ == "__main__":
    main()
