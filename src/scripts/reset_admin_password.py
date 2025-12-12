
import psycopg2
import hashlib
import os

DB_URL = "postgresql://postgres.urqbpbbomdpejbxhlgqq:gd3yF6HR9cK6@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def reset_password():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        username = "admin"
        password = "admin"
        p_hash = hash_password(password)
        
        # Check if user exists
        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        row = cur.fetchone()
        
        if row:
            print(f"User {username} found. Updating password...")
            cur.execute("UPDATE users SET password_hash = %s WHERE username = %s", (p_hash, username))
        else:
            print(f"User {username} NOT found. Creating...")
            cur.execute("INSERT INTO users (username, password_hash, role) VALUES (%s, %s, 'super_admin')", (username, p_hash))
            
        conn.commit()
        print("Password reset successful.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_password()
