
import psycopg2
import os

def debug_update():
    try:
        print("Connecting to DB...")
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        
        pulse_type = "Tur Dal"
        print(f"Searching for {pulse_type}...")
        
        cur.execute("SELECT id, price FROM market_prices WHERE pulse_type ILIKE %s ORDER BY fetched_at DESC LIMIT 1", (pulse_type,))
        row = cur.fetchone()
        
        if not row:
            print("No row found!")
            return
            
        latest_id = row[0]
        price = row[1]
        print(f"Found ID: {latest_id}, Price: {price}")
        
        print("Attempting Update...")
        cur.execute("""
            UPDATE market_prices 
            SET predicted_next_week = 9000.50, trend_direction = 'UP' 
            WHERE id = %s
        """, (latest_id,))
        
        conn.commit()
        print("Committed.")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_update()
