
import psycopg2
import time
import uuid

DB_URL = "postgresql://postgres.urqbpbbomdpejbxhlgqq:gd3yF6HR9cK6@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"

def run_sanity_job():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # 1. Inject Job
    job_id = str(uuid.uuid4())
    print(f"Injecting Job {job_id}: 'Check stock of Wheat'...")
    cur.execute("INSERT INTO agent_jobs (id, command, status) VALUES (%s, %s, 'PENDING')", (job_id, "Check stock of Wheat"))
    conn.commit()
    
    # 2. Poll for Result
    print("Waiting for Agent to process...")
    start = time.time()
    while time.time() - start < 120: # Wait up to 2 mins (agent poll is slow + startup)
        cur.execute("SELECT status, result FROM agent_jobs WHERE id = %s", (job_id,))
        row = cur.fetchone()
        if row:
            status, result = row
            if status == 'COMPLETED':
                print(f"✅ Job Completed!\nResult: {result}")
                return
            elif status == 'FAILED':
                print(f"❌ Job Failed!\nError: {result}")
                return
            else:
                print(f"Status: {status}...", end='\r')
        time.sleep(2)
        
    print("\n❌ Timeout waiting for job completion.")
    conn.close()

if __name__ == "__main__":
    run_sanity_job()
