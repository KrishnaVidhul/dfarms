import time
import os
import sys

# Setup Logger
sys.path.append(os.path.join(os.path.dirname(__file__), '../agent_runtime'))
try:
    from agent_logger import AgentMonitor
except:
    class AgentMonitor:
        def __init__(self, name): self.name = name
        def update_status(self, s, t): print(f"[{self.name}] {s}: {t}")

def main():
    monitor = AgentMonitor("Scout")
    monitor.update_status("SCANNING", "Analyzing Market Data...")
    time.sleep(2) # Simulate work
    monitor.update_status("IDLE", "Market Analysis Complete.")

if __name__ == "__main__":
    main()
