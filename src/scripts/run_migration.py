#!/usr/bin/env python3
"""
Create or update market_prices table for e-NAM integration
"""

import os
import psycopg2

DB_URL = os.environ.get('DATABASE_URL')

def run_migration():
    if not DB_URL:
        print("ERROR: DATABASE_URL not set")
        return
    
    conn = psycopg2.connect(DB_URL)
    cursor = conn.cursor()
    
    print("Setting up market_prices table...")
    
    # Drop and recreate table to ensure clean schema
    cursor.execute("""
        DROP TABLE IF EXISTS market_prices CASCADE;
        
        CREATE TABLE market_prices (
            id SERIAL PRIMARY KEY,
            commodity VARCHAR(200) NOT NULL,
            state VARCHAR(100),
            market_name VARCHAR(200),
            variety VARCHAR(100),
            grade VARCHAR(50),
            min_price DECIMAL(10,2),
            max_price DECIMAL(10,2),
            modal_price DECIMAL(10,2),
            arrival_date DATE,
            fetched_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(commodity, market_name, arrival_date)
        );
        
        -- Create indexes for faster filtering
        CREATE INDEX idx_market_prices_commodity ON market_prices(commodity);
        CREATE INDEX idx_market_prices_state ON market_prices(state);
        CREATE INDEX idx_market_prices_arrival_date ON market_prices(arrival_date);
        CREATE INDEX idx_market_prices_fetched_at ON market_prices(fetched_at);
        
        -- Add comment
        COMMENT ON TABLE market_prices IS 'Stores daily commodity prices from e-NAM/AGMARKNET';
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("✓ market_prices table created successfully!")

if __name__ == "__main__":
    run_migration()
