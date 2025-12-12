-- Ensure batches table has necessary columns for Unified Data
-- We use ALTER TABLE ... ADD COLUMN IF NOT EXISTS to be safe

ALTER TABLE batches ADD COLUMN IF NOT EXISTS quantity DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE batches ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE batches ADD COLUMN IF NOT EXISTS yield_percent DECIMAL(5, 2) DEFAULT 0;

-- Ensure current_stage exists (it should, but just in case)
-- ALTER TABLE batches ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) DEFAULT 'RAW';

-- Create an index for performance if not exists
CREATE INDEX IF NOT EXISTS idx_batches_commodity ON batches(commodity_id);
CREATE INDEX IF NOT EXISTS idx_batches_stage ON batches(current_stage);
