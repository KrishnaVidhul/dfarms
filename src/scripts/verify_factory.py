import sys
import time
import requests
import psycopg2

# Configuration
DB_CONFIG = {
    'dbname': 'dfarms_db',
    'user': 'dfarms_user',
    'password': 'change_me_in_prod',
    'host': 'localhost',
    'port': 5432
}
OLLAMA_URL = "http://localhost:11434"
WEB_URL = "http://localhost:3000"

def check_db():
    print(f"Checking DB at {DB_CONFIG['host']}:{DB_CONFIG['port']}...")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.close()
        print("✅ DB Connection Successful")
        return True
    except Exception as e:
        print(f"❌ DB Connection Failed: {e}")
        return False

def check_http(name, url):
    print(f"Checking {name} at {url}...")
    try:
        resp = requests.get(url, timeout=5)
        # Any response helps confirming it's up, dependent on if endpoints exist
        # Next.js might return 404 if page not found but server is up. 
        # Ollama might return 200 'Ollama is running'.
        if resp.status_code < 600: 
             print(f"✅ {name} returned {resp.status_code}")
             return True
    except Exception as e:
        print(f"❌ {name} unreachable: {e}")
        return False

def main():
    print("D Farms Factory Verification")
    print("----------------------------")
    checks = [
        lambda: check_db(),
        lambda: check_http("Ollama", OLLAMA_URL),
        lambda: check_http("Next.js", WEB_URL)
    ]
    
    results = []
    for check in checks:
        results.append(check())
        
    if all(results):
        print("\n🚀 All Systems Operational")
        sys.exit(0)
    else:
        print("\n💥 System Verification Failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
