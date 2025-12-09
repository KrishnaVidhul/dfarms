import json
import os
import psycopg2
from psycopg2 import sql
import sys

# Load Blueprint
BLUEPRINT_PATH = os.path.join(os.path.dirname(__file__), '../docs/universal_erp_blueprint.json')
BACKLOG_PATH = os.path.join(os.path.dirname(__file__), '../design_backlog.md')

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

def append_to_backlog(module_name, missing_table, feature_info):
    """Add a gap ticket to the backlog."""
    
    # Check if already exists to avoid dupes
    if os.path.exists(BACKLOG_PATH):
        with open(BACKLOG_PATH, 'r') as f:
            if f"Module: {module_name}" in f.read():
                return # Skip if module already flagged (Simplification)

    print(f"[Gap Hunter] 🚨 Gap Detected: {module_name} is missing table '{missing_table}'")
    
    entry = f"\n## Feature: {feature_info['name']}\n"
    entry += f"**Source:** Gap Hunter Audit\n"
    entry += f"**Priority:** {feature_info.get('priority', 'Medium')}\n"
    entry += f"**Idea:** The system is missing the '{module_name}' module (specifically '{missing_table}'). Implement the core tables and the {feature_info['name']}.\n"
    entry += f"**Context:** Required for '{module_name}' compliance according to Universal Blueprint.\n"
    
    try:
        with open(BACKLOG_PATH, 'a') as f:
            f.write(entry)
        print(f"[Gap Hunter] ✅ Added to Backlog: {feature_info['name']}")
    except Exception as e:
        print(f"[Gap Hunter] ❌ Failed to write to backlog: {e}")

def main():
    print("--- GAP HUNTER STARTED ---")
    
    if not os.path.exists(BLUEPRINT_PATH):
        print(f"Error: Blueprint not found at {BLUEPRINT_PATH}")
        sys.exit(1)

    with open(BLUEPRINT_PATH, 'r') as f:
        blueprint = json.load(f)

    try:
        current_tables = get_db_tables()
        print(f"[Gap Hunter] Found {len(current_tables)} existing tables.")
    except Exception as e:
        print(f"[Gap Hunter] DB Connection Failed: {e}")
        sys.exit(1)

    gaps_found = 0
    
    for module_key, module_data in blueprint['modules'].items():
        missingInModule = []
        for table in module_data['required_tables']:
            if table not in current_tables:
                missingInModule.append(table)
        
        if missingInModule:
            # We found a gap! Select the first feature to implement
            feature = module_data['features'][0]
            append_to_backlog(module_data['title'], missingInModule[0], feature)
            gaps_found += 1

    if gaps_found == 0:
        print("[Gap Hunter] No strategic gaps detected. System is compliant.")
    else:
        print(f"[Gap Hunter] Analysis Complete. Found {gaps_found} strategic gaps.")

if __name__ == "__main__":
    main()
