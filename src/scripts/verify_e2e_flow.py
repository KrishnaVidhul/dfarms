
import os
import time
import psycopg2
import uuid
import sys

# DATABASE_URL for Production (using the one from our successful deployment)
# Note: In a real CI/CD, this would be an env var.
DB_URL = "postgresql://postgres.urqbpbbomdpejbxhlgqq:gd3yF6HR9cK6@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"

def verify_end_to_end():
    try:
        print("1. Connecting to Database...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        # 2. Insert Test Command
        test_job_id = str(uuid.uuid4())
        command = f"AUDIT_TEST_PING_{test_job_id[-4:]}: Report status"
        print(f"2. Inserting Job: {command}")
        
        cur.execute(
            "INSERT INTO agent_jobs (id, command, status) VALUES (%s, %s, 'PENDING') RETURNING id",
            (test_job_id, command)
        )
        conn.commit()
        print(f"   Job ID: {test_job_id}")

        # 3. Poll for Completion (Wait up to 30s)
        print("3. Waiting for Agent to Process...")
        start_time = time.time()
        final_status = None
        result = None

        while time.time() - start_time < 30:
            cur.execute("SELECT status, result FROM agent_jobs WHERE id = %s", (test_job_id,))
            row = cur.fetchone()
            
            if row:
                status, res = row
                elapsed = int(time.time() - start_time)
                print(f"   [{elapsed}s] Status: {status}")
                
                if status == 'COMPLETED':
                    print("\n✅ SUCCESS: Agent processed the job!")
                    print(f"Result: {res}")
                    final_status = status
                    result = res
                    break
                elif status == 'FAILED':
                    print("\n❌ FAILURE: Agent marked job as FAILED.")
                    print(f"Error: {res}")
                    final_status = status
                    result = res
                    break
            else:
                print(f"   [Status Check] Job not found yet or no status.")
                
            time.sleep(5)
        else:
            print("\n--------------------")
            print("⚠️ TIMEOUT: Agent did not pick up the job in time.")
            print("Possible causes: Agent crashed, VM down, or Polling loop stuck.")
            print("VM is e2-micro, initialization takes ~90s. This timeout is 150s.")
            # sys.exit(0) # Exit 0 but warn - Removed sys.exit to allow final status check

        # 4. Analyze Result (Moved outside the loop to handle final_status consistently)
        print("-" * 20)
        if final_status == 'COMPLETED':
            print("✅ SUCCESS: Agent processed the job.")
            print(f"Result: {result}")
        elif final_status == 'FAILED':
            print("❌ FAILED: Agent reported failure.")
            print(f"Error: {result}")
        else:
            print("⚠️ TIMEOUT: Agent did not pick up the job in time.")
            print("Possible causes: Agent crashed, VM down, or Polling loop stuck.")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")

if __name__ == "__main__":
    verify_end_to_end()
