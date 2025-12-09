import json
import os
import psycopg2
import sys

# Setup Logger
sys.path.append(os.path.join(os.path.dirname(__file__), '../agent_runtime'))
try:
    from agent_logger import AgentMonitor
except:
    class AgentMonitor:
        def __init__(self, name): self.name = name
        def update_status(self, s, t): print(f"[{self.name}] {s}: {t}")

# Load Blueprint
BLUEPRINT_PATH = os.path.join(os.path.dirname(__file__), '../docs/universal_erp_blueprint.json')

def get_db_tables():
    """Fetch all table names from the public schema."""
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    tables = [row[0] for row in cur.fetchall()]
    conn.close()
    return set(tables)

def main():
    monitor = AgentMonitor("Gap_Hunter")
    monitor.update_status("SCANNING", "Analyzing Database vs Blueprint...")
    
    if not os.path.exists(BLUEPRINT_PATH):
        monitor.update_status("ERROR", f"Blueprint not found at {BLUEPRINT_PATH}")
        sys.exit(1)

    with open(BLUEPRINT_PATH, 'r') as f:
        blueprint = json.load(f)

    try:
        current_tables = get_db_tables()
        monitor.update_status("SCANNING", f"Found {len(current_tables)} existing tables.")
    except Exception as e:
        monitor.update_status("ERROR", f"DB Connection Failed: {e}")
        sys.exit(1)

    gaps_found = 0
    
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    monitor.update_status("THINKING", "Identifying missing modules...")

    for module_key, module_data in blueprint['modules'].items():
        missingInModule = []
        for table in module_data['required_tables']:
            if table not in current_tables:
                missingInModule.append(table)
        
        if missingInModule:
            # We found a gap! Select the first feature to implement
            feature_info = module_data['features'][0]
            
            # Check if already exists in roadmap
            cur.execute("SELECT 1 FROM feature_roadmap WHERE feature_name = %s", (feature_info['name'],))
            if cur.fetchone():
                continue
                
            monitor.update_status("PLANNED", f"Injecting Feature: {feature_info['name']}")
            cur.execute(
                "INSERT INTO feature_roadmap (feature_name, status, source) VALUES (%s, 'PLANNED', 'Gap Hunter')",
                (feature_info['name'],)
            )
            gaps_found += 1
            # Only add one per run to avoid spamming
            break 
            
    conn.commit()
    conn.close()

    if gaps_found == 0:
        monitor.update_status("IDLE", "System is compliant. No gaps.")
    else:
        monitor.update_status("IDLE", f"Injection Complete. Added {gaps_found} new tasks.")
if __name__ == "__main__":
    main()
