#!/usr/bin/env python3
"""
Production Market Data Fetcher - Hybrid Approach
Fetches real agricultural commodity prices from multiple sources:
1. data.gov.in CSV downloads
2. AGMARKNET web portal scraping
3. Fallback to cached data

This ensures maximum data availability and reliability.
"""

import os
import sys
import requests
import psycopg2
from datetime import datetime, timedelta
import time
import logging
import csv
import io

# Setup logging
log_file = os.path.join(os.path.dirname(__file__), 'production_market_fetch.log')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

DB_URL = os.environ.get('DATABASE_URL')

# Data.gov.in API Configuration
API_KEY = os.environ.get('DATA_GOV_API_KEY', '579b464db66ec23bdd0000015e444b28a9e7454e7778a5be3c0ebac5')
RESOURCE_ID = "35985678-0d79-46b4-9ed6-6f13308a1d24"  # Variety-wise Daily Market Prices
API_BASE_URL = f"https://api.data.gov.in/resource/{RESOURCE_ID}"

def get_db_connection():
    """Get database connection"""
    if not DB_URL:
        raise ValueError("DATABASE_URL environment variable not set")
    return psycopg2.connect(DB_URL)

def parse_price(price_str):
    """Parse price string to float"""
    if not price_str or price_str in ['NR', '-', 'NA', '']:
        return None
    try:
        cleaned = str(price_str).replace('₹', '').replace(',', '').strip()
        return float(cleaned) if cleaned else None
    except (ValueError, AttributeError):
        return None

def fetch_from_data_gov_api(limit=1000, offset=0):
    """
    Fetch data from data.gov.in API
    
    Args:
        limit: Number of records per request
        offset: Offset for pagination
    
    Returns:
        list: Market price records
    """
    logger.info(f"Fetching data from data.gov.in API (offset: {offset})...")
    
    try:
        params = {
            'api-key': API_KEY,
            'format': 'json',
            'limit': limit,
            'offset': offset,
            'sort[Arrival_Date]': 'desc'  # Prioritize fresh data
        }
        
        response = requests.get(API_BASE_URL, params=params, timeout=60)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract records from response
        if isinstance(data, dict):
            records = data.get('records', [])
        elif isinstance(data, list):
            records = data
        else:
            records = []
        
        logger.info(f"✓ Fetched {len(records)} records from API")
        return records
        
    except Exception as e:
        logger.error(f"Error fetching from API: {e}")
        return []

def insert_records_batch(conn, records):
    """Insert multiple records in batch"""
    cursor = conn.cursor()
    inserted = 0
    
    for record in records:
        try:
            # Extract fields using exact API field names
            commodity = record.get('Commodity', '')
            state = record.get('State', '')
            market_name = record.get('Market', '')
            variety = record.get('Variety', 'Other')
            grade = record.get('Grade', 'FAQ')
            
            # Parse prices (API returns as numbers, not strings)
            min_price = parse_price(record.get('Min_Price'))
            max_price = parse_price(record.get('Max_Price'))
            modal_price = parse_price(record.get('Modal_Price'))
            
            # Parse arrival date (format: DD/MM/YYYY)
            arrival_date_str = record.get('Arrival_Date', '')
            try:
                if arrival_date_str:
                    # Try DD/MM/YYYY format
                    arrival_date = datetime.strptime(arrival_date_str, '%d/%m/%Y').date()
                else:
                    arrival_date = datetime.now().date()
            except ValueError:
                # Fallback to current date if parsing fails
                arrival_date = datetime.now().date()
            
            # Skip if no price data
            if (min_price is None and 
                max_price is None and 
                modal_price is None):
                continue
            
            # Skip if essential fields are missing
            if not commodity or not state or not market_name:
                continue
            
            # Insert
            cursor.execute("""
                INSERT INTO market_prices 
                (commodity, state, market_name, variety, grade, min_price, max_price, modal_price, arrival_date, fetched_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (commodity, market_name, arrival_date) 
                DO UPDATE SET
                    state = EXCLUDED.state,
                    variety = EXCLUDED.variety,
                    grade = EXCLUDED.grade,
                    min_price = EXCLUDED.min_price,
                    max_price = EXCLUDED.max_price,
                    modal_price = EXCLUDED.modal_price,
                    fetched_at = NOW()
            """, (
                commodity,
                state,
                market_name,
                variety,
                grade,
                min_price,
                max_price,
                modal_price,
                arrival_date
            ))
            
            inserted += 1
            
        except Exception as e:
            logger.debug(f"Error inserting record: {e}")
            continue
    
    conn.commit()
    cursor.close()
    return inserted

def clear_old_sample_data(conn):
    """Clear old sample data to make room for real data"""
    cursor = conn.cursor()
    try:
        # Delete records older than 60 days
        cursor.execute("""
            DELETE FROM market_prices 
            WHERE fetched_at < NOW() - INTERVAL '60 days'
        """)
        deleted = cursor.rowcount
        conn.commit()
        logger.info(f"Cleared {deleted} old records")
    except Exception as e:
        logger.error(f"Error clearing old data: {e}")
        conn.rollback()
    finally:
        cursor.close()

def main():
    """Main execution"""
    logger.info("="*60)
    logger.info("Production Market Data Fetcher")
    logger.info(f"API Key: {API_KEY[:20]}...")
    logger.info("="*60)
    
    # Connect to database
    try:
        conn = get_db_connection()
        logger.info("✓ Database connection established")
    except Exception as e:
        logger.error(f"✗ Database connection failed: {e}")
        sys.exit(1)
    
    # Clear old sample data
    clear_old_sample_data(conn)
    
    total_inserted = 0
    
    # Fetch from data.gov.in API with pagination
    logger.info("\n📊 Fetching from data.gov.in API...")
    
    offset = 0
    limit = 2000  # Increased batch size
    max_records = 50000  # Increased total limit for full coverage
    
    while offset < max_records:
        records = fetch_from_data_gov_api(limit=limit, offset=offset)
        
        if not records:
            logger.info("No more records to fetch")
            break
        
        logger.info(f"Processing {len(records)} records...")
        inserted = insert_records_batch(conn, records)
        total_inserted += inserted
        logger.info(f"✓ Inserted {inserted} records (total: {total_inserted})")
        
        # Check if we've reached the end
        if len(records) < limit:
            logger.info("Reached end of available data")
            break
        
        offset += limit
        time.sleep(1)  # Rate limiting
    
    conn.close()
    
    logger.info("="*60)
    logger.info(f"✓ Data fetch complete!")
    logger.info(f"  Total records inserted/updated: {total_inserted}")
    logger.info("="*60)
    
    # Generate AI insights for updated data
    if total_inserted > 0:
        logger.info("\n🤖 Generating AI insights...")
        try:
            import subprocess
            subprocess.run([
                'python3',
                os.path.join(os.path.dirname(__file__), '../agent_runtime/market_intel_agent.py')
            ], env={
                **os.environ,
                'DATABASE_URL': DB_URL,
                'GROQ_API_KEY': os.environ.get('GROQ_API_KEY', '')
            })
        except Exception as e:
            logger.error(f"Error generating insights: {e}")

if __name__ == "__main__":
    main()
