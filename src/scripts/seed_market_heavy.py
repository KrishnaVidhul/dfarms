import psycopg2
import os
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    print("Error: DATABASE_URL is not set.")
    exit(1)

commodities = [
    "Tur Dal", "Chana", "Moong Dal", "Urad Dal", "Wheat (Lokwan)", 
    "Rice (Basmati)", "Cotton", "Soybean", "Maize", "Sugarcane", 
    "Jowar", "Bajra", "Groundnut", "Mustard Seed", "Onion"
]

locations = ["Akola", "Latur", "Amravati", "Nagpur", "Pune"]

try:
    conn = psycopg2.connect(DB_URL)
    cursor = conn.cursor()
    
    # Clear existing to show fresh data
    cursor.execute("DELETE FROM market_prices;")
    
    print(f"Seeding {len(commodities)} commodities over 7 days...")
    
    for commodity in commodities:
        base_price = random.randint(30, 150)
        for i in range(7):
            # Price fluctuates slightly
            daily_price = base_price + random.randint(-5, 10)
            date_offset = datetime.now() - timedelta(days=6-i) # Past 7 days
            
            cursor.execute("""
                INSERT INTO market_prices (pulse_type, location, price, recommendation, fetched_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                commodity, 
                random.choice(locations), 
                str(daily_price),
                random.choice(["Buy", "Sell", "Wait"]),
                date_offset
            ))
            
    conn.commit()
    print("Seeding Complete. Market Data Scaled.")
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
