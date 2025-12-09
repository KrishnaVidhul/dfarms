import time
import psycopg2
import os
import requests
import json
import logging

# Configuration
DB_URL = os.getenv("DATABASE_URL", "postgresql://dfarms_user:change_me_in_prod@db:5432/dfarms_db")
WEB_URL = "http://dfarms_web:3000/api/inventory" # Internal Docker Network URL
HEALTH_FILE = "/app/src/web/public/system_health.json" # Shared Volume Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Watchdog")

def run_integrity_check():
    conn = None
    try:
        # 1. Connect to DB
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        # 2. Inject Ghost Record
        logger.info("Injecting Ghost Record...")
        cur.execute("""
            INSERT INTO inventory (batch_id, pulse_type, weight_kg, grade, status, updated_at)
            VALUES ('BATCH-GHOST-001', 'Ghost Item', 1, 'TEST', 'Verifying', NOW())
        """)
        conn.commit()

        # 3. Verify via Web API
        # Wait a moment for any potential propagation (though it should be instant for direct DB)
        time.sleep(1) 
        
        logger.info(f"Querying Web API: {WEB_URL}")
        response = requests.get(WEB_URL, timeout=5)
        
        if response.status_code != 200:
            raise Exception(f"Web API Failed: {response.status_code}")
            
        data = response.json()
        inventory = data.get('inventory', [])
        
        # Check if Ghost Item is present
        found = any(item.get('pulse_type') == 'Ghost Item' for item in inventory)
        
        status = "HEALTHY" if found else "FAILED"
        message = "Integrity Check Passed" if found else "CRITICAL: Web API serves stale data"
        
        logger.info(f"Result: {status} - {message}")

        # 4. Write Health Status
        health_data = {
            "ui_sync_status": status,
            "last_checked": time.strftime("%Y-%m-%d %H:%M:%S"),
            "message": message
        }
        
        # Ensure directory exists (it should via volume map, but writing to mapped path)
        # Note: In container, /app/src/web/public maps to host src/web/public
        with open(HEALTH_FILE, 'w') as f:
            json.dump(health_data, f)

    except Exception as e:
        logger.error(f"Watchdog Failed: {e}")
        error_data = {
            "ui_sync_status": "FAILED",
            "last_checked": time.strftime("%Y-%m-%d %H:%M:%S"),
            "message": str(e)
        }
        try:
             with open(HEALTH_FILE, 'w') as f:
                json.dump(error_data, f)
        except:
            pass

    finally:
        # 5. Cleanup
        if conn:
            try:
                cur = conn.cursor()
                cur.execute("DELETE FROM inventory WHERE batch_id = 'BATCH-GHOST-001'")
                conn.commit()
                conn.close()
                logger.info("Cleanup Complete.")
            except Exception as e:
                logger.error(f"Cleanup Failed: {e}")

if __name__ == "__main__":
    logger.info("Starting Integrity Watchdog...")
    # Run once for this execution trigger
    run_integrity_check()
