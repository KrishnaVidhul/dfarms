import time
import subprocess
import sys
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = 0
        self.debounce_seconds = 10

    def on_modified(self, event):
        if event.is_directory:
            return
        
        if not event.src_path.endswith('.tsx'):
            return
        
        # Debounce
        current_time = time.time()
        if (current_time - self.last_modified) < self.debounce_seconds:
            return
            
        self.last_modified = current_time
        print(f"\n[Watchdog] Detected change in: {event.src_path}")
        
        # Trigger Refactor Engine
        try:
            print("[Watchdog] Triggering Refactoring Engine...")
            subprocess.run(
                ["python", "src/scripts/refactor_engine.py", "--file", event.src_path], 
                check=False
            )
        except Exception as e:
            print(f"[Watchdog] Error triggering engine: {e}")

if __name__ == "__main__":
    path = "src/web/app"
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    
    print(f"\n[Watchdog] Monitoring {path} for .tsx changes...")
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
