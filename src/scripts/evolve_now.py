import subprocess
import re
import os
import sys

def main():
    print("--- STARTING EVOLUTION CYCLE ---")
    
    
    # -1. Gap Hunter (Strategic Analysis)
    print("\n[Evolution] Trace -1: Analyzing Structural Gaps (Gap Hunter)...")
    try:
        subprocess.run(["python", "src/scripts/gap_hunter.py"], check=False)
    except Exception as e:
        print(f"[Evolution] Gap Hunter failed: {e}")

    # 0. Innovation Lab (Research)
    print("\n[Evolution] Trace 0: Researching new features (Innovation Lab)...")
    try:
        subprocess.run(["python", "src/scripts/innovation_lab.py"], check=False)
    except Exception as e:
        print(f"[Evolution] Innovation Lab failed: {e}")

    # 1. Run UX Audit
    print("\n[Evolution] Trace 1: Triggering UX Audit (Arjun)...")
    subprocess.run(["python", "src/scripts/ux_audit.py"], check=True)
    
    # 2. Parse Backlog
    print("\n[Evolution] Trace 2: Parsing Design Backlog...")
    backlog_path = "src/design_backlog.md"
    
    if not os.path.exists(backlog_path):
        print("Error: Backlog not found.")
        sys.exit(1)
        
    with open(backlog_path, 'r') as f:
        lines = f.readlines()
        
    # Find the top priority feature (Sort logic in ux_audit puts it at top of table)
    # Markdown Table format: | Priority | Feature | ...
    # Skip headers
    ticket = None
    for line in lines:
        if line.strip().startswith("| 1 |"): # Priority 1
            # Extract Feature Name between ** **
            match = re.search(r'\*\*(.*?)\*\*', line)
            if match:
                ticket = match.group(1)
                break
    
    if ticket:
        print(f"\n[Evolution] Trace 3: Selected High Priority Ticket: '{ticket}'")
        
        # 3. Trigger Feature Factory
        print(f"\n[Evolution] Trace 4: Triggering Refactor Engine in Feature Mode...")
        subprocess.run(["python", "src/scripts/refactor_engine.py", "--feature", ticket], check=True)
        
        print("\n[Evolution] CYCLE COMPLETE. Feature Implemented and PR Sent.")
    else:
        print("[Evolution] No Priority 1 tickets found.")

if __name__ == "__main__":
    main()
