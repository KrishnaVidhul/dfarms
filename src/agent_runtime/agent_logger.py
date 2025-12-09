import os
import psycopg2
import time
from datetime import datetime

class AgentMonitor:
    def __init__(self, agent_name):
        self.agent_name = agent_name
        self.db_url = os.getenv("DATABASE_URL")
        
    def _connect(self):
        try:
            return psycopg2.connect(self.db_url)
        except Exception as e:
            print(f"[{self.agent_name}] DB Connection Failed: {e}")
            return None

    def update_status(self, status, thought):
        """Updates the heartbeat table with current activity."""
        print(f"[{self.agent_name}] {status}: {thought}") # Console backup
        
        conn = self._connect()
        if not conn: return
        
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO agent_heartbeats (agent_name, status, current_thought, last_active)
                VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (agent_name) DO UPDATE 
                SET status = EXCLUDED.status, 
                    current_thought = EXCLUDED.current_thought,
                    last_active = CURRENT_TIMESTAMP;
            """, (self.agent_name, status, thought))
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f"[{self.agent_name}] Heartbeat Failed: {e}")

    def log(self, message):
        """Appends a log entry to agent_logs."""
        conn = self._connect()
        if not conn: return
        
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO agent_logs (agent_name, log_message, created_at)
                VALUES (%s, %s, CURRENT_TIMESTAMP);
            """, (self.agent_name, message))
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f"[{self.agent_name}] Log Failed: {e}")
