-- Migration: Update market_prices table for e-NAM integration
-- Run this on Supabase database

-- Add new columns for detailed market data
ALTER TABLE market_prices 
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS market_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS min_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS max_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS modal_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS variety VARCHAR(100),
ADD COLUMN IF NOT EXISTS grade VARCHAR(50),
ADD COLUMN IF NOT EXISTS arrival_date DATE;

-- Rename existing 'price' column to 'modal_price' if it exists
-- (This is a safe operation - will only run if column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'market_prices' AND column_name = 'price'
    ) THEN
        ALTER TABLE market_prices RENAME COLUMN price TO modal_price;
    END IF;
END $$;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON market_prices(commodity);
CREATE INDEX IF NOT EXISTS idx_market_prices_state ON market_prices(state);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices(fetched_at);
CREATE INDEX IF NOT EXISTS idx_market_prices_arrival_date ON market_prices(arrival_date);

-- Add comment
COMMENT ON TABLE market_prices IS 'Stores daily commodity prices from e-NAM/AGMARKNET';
