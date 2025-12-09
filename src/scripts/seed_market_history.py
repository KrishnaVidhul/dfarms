
import psycopg2
import os
import random
from datetime import datetime, timedelta

def seed_history():
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        
        # Pulses to seed
        pulses = [
            {"name": "Tur Dal", "base_price": 8500, "location": "Akola Mandi"},
            {"name": "Chana", "base_price": 5800, "location": "Akola Mandi"}
        ]
        
        # 30 days of history
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        print(f"Seeding history from {start_date.date()} to {end_date.date()}...")
        
        inserted_count = 0
        
        for pulse in pulses:
            current_date = start_date
            price = pulse["base_price"]
            
            while current_date <= end_date:
                # Random fluctuation (-50 to +50 rupees)
                fluctuation = random.randint(-50, 50)
                price += fluctuation
                
                # Format price string
                price_str = f"{price} INR/Q"
                
                # Fetch Time
                fetched_at = current_date.strftime("%Y-%m-%d %H:%M:%S")
                
                cur.execute("""
                    INSERT INTO market_prices (pulse_type, location, price, fetched_at, trend_direction, recommendation)
                    VALUES (%s, %s, %s, %s, 'FLAT', 'Hold')
                """, (pulse["name"], pulse["location"], price_str, fetched_at))
                
                current_date += timedelta(days=1)
                inserted_count += 1
                
        conn.commit()
        cur.close()
        conn.close()
        print(f"Success! Inserted {inserted_count} historical records.")
        
    except Exception as e:
        print(f"Error seeding history: {e}")

if __name__ == "__main__":
    seed_history()
