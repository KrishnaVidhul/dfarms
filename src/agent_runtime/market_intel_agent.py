#!/usr/bin/env python3
"""
Market Intelligence Agent (Direct LLM Implementation)
Lightweight version using direct Groq API calls instead of CrewAI
"""
import os
import json
import time
from datetime import datetime, timedelta
import psycopg2
import statistics
from typing import List, Dict, Optional
import requests

print(f"LOADING FROM: {__file__}")
print(f"CWD: {os.getcwd()}")
print("="*60)

DB_URL = os.environ.get('DATABASE_URL')
# Use direct connection (port 5432) instead of pooler to avoid SSL issues
if DB_URL and ':6543/' in DB_URL:
    DB_URL = DB_URL.replace(':6543/', ':5432/')
    
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')

def get_db_connection(retries=3):
    for attempt in range(retries):
        try:
            return psycopg2.connect(DB_URL)
        except Exception as e:
            if attempt < retries - 1:
                print(f"DB connection attempt {attempt + 1} failed, retrying...")
                time.sleep(1)
            else:
                print(f"Error connecting to DB: {e}")
                return None

# ==============================================================================
# INLINE MARKET ANALYSIS TOOLS
# ==============================================================================

def get_price_history(commodity: str, days: int = 30) -> List[Dict]:
    """Get historical price data for a commodity"""
    conn = get_db_connection()
    if not conn: return []
    try:
        cursor = conn.cursor()
        query = """
            SELECT 
                arrival_date,
                AVG(modal_price) as avg_price,
                AVG(min_price) as avg_min,
                AVG(max_price) as avg_max,
                COUNT(*) as market_count
            FROM market_prices
            WHERE commodity ILIKE %s
                AND arrival_date >= CURRENT_DATE - INTERVAL '%s days'
                AND modal_price IS NOT NULL
            GROUP BY arrival_date
            ORDER BY arrival_date ASC
        """
        cursor.execute(query, (f'%{commodity}%', days))
        results = cursor.fetchall()
        return [
            {
                'date': row[0].isoformat() if row[0] else None,
                'price': float(row[1]) if row[1] else 0,
                'min_price': float(row[2]) if row[2] else 0,
                'max_price': float(row[3]) if row[3] else 0,
                'market_count': int(row[4])
            }
            for row in results
        ]
    except Exception as e:
        print(f"Error getting history: {e}")
        return []
    finally:
        conn.close()

def calculate_moving_average(prices: List[float], window: int) -> Optional[float]:
    if len(prices) < window: return None
    return statistics.mean(prices[-window:])

def calculate_volatility(prices: List[float]) -> float:
    if len(prices) < 2: return 0.0
    return statistics.stdev(prices)

def detect_trend(prices: List[float]) -> str:
    if len(prices) < 5: return 'INSUFFICIENT_DATA'
    short_ma = calculate_moving_average(prices, 5)
    long_ma = calculate_moving_average(prices, 10) if len(prices) >= 10 else short_ma
    if short_ma is None or long_ma is None: return 'INSUFFICIENT_DATA'
    if short_ma > long_ma * 1.02: return 'UPTREND'
    elif short_ma < long_ma * 0.98: return 'DOWNTREND'
    else: return 'SIDEWAYS'

def analyze_price_trends(commodity: str, days: int = 30) -> Dict:
    """Comprehensive price trend analysis"""
    history = get_price_history(commodity, days)
    if not history: return {'error': 'No price data available', 'commodity': commodity}
    
    prices = [h['price'] for h in history if h['price'] > 0]
    if len(prices) < 5: return {'error': 'Insufficient data', 'commodity': commodity}
    
    current_price = prices[-1]
    ma_7 = calculate_moving_average(prices, 7)
    ma_30 = calculate_moving_average(prices, 30) if len(prices) >= 30 else ma_7
    volatility = calculate_volatility(prices)
    trend = detect_trend(prices)
    
    if len(prices) >= 2: 
        price_change = ((prices[-1] - prices[0]) / prices[0]) * 100
    else: 
        price_change = 0
    
    support = min(prices[-10:]) if len(prices) >= 10 else min(prices)
    resistance = max(prices[-10:]) if len(prices) >= 10 else max(prices)
    
    return {
        'commodity': commodity,
        'current_price': round(current_price, 2),
        'ma_7': round(ma_7, 2) if ma_7 else None,
        'ma_30': round(ma_30, 2) if ma_30 else None,
        'volatility': round(volatility, 2),
        'trend': trend,
        'support': round(support, 2),
        'resistance': round(resistance, 2),
        'price_change_pct': round(price_change, 2),
        'data_points': len(prices)
    }

# ==============================================================================
# DIRECT LLM ANALYSIS (No CrewAI)
# ==============================================================================

def analyze_commodity(commodity: str) -> Dict:
    """
    Analyze a single commodity using rule-based technical analysis
    """
    print(f"📊 Analyzing {commodity}...")
    
    # Get technical analysis
    analysis = analyze_price_trends(commodity)
    
    if 'error' in analysis:
        return {
            'status': 'error',
            'message': analysis['error'],
            'recommendation': {
                'commodity': commodity,
                'recommendation': 'HOLD',
                'confidence': 0,
                'current_price': 0,
                'target_price': 0,
                'reasoning': analysis['error']
            }
        }
    
    # Rule-based recommendation logic
    score = 0
    factors = []
    
    current_price = analysis['current_price']
    ma_7 = analysis.get('ma_7')
    ma_30 = analysis.get('ma_30')
    trend = analysis['trend']
    support = analysis['support']
    resistance = analysis['resistance']
    price_change = analysis['price_change_pct']
    
    # Factor 1: Trend Analysis (30 points)
    if trend == 'UPTREND':
        score += 30
        factors.append(f"Strong upward trend detected")
    elif trend == 'DOWNTREND':
        score -= 30
        factors.append(f"Downward trend detected")
    else:
        factors.append(f"Sideways market movement")
    
    # Factor 2: Price vs Moving Averages (25 points)
    if ma_7 and ma_30:
        if current_price < ma_30 * 0.95:
            score += 25
            factors.append(f"Price 5%+ below 30-day average (₹{ma_30})")
        elif current_price > ma_30 * 1.05:
            score -= 25
            factors.append(f"Price 5%+ above 30-day average (₹{ma_30})")
    
    # Factor 3: Price Change Momentum (20 points)
    if price_change > 5:
        score += 20
        factors.append(f"Strong positive momentum (+{price_change:.1f}%)")
    elif price_change < -5:
        score -= 20
        factors.append(f"Negative momentum ({price_change:.1f}%)")
    
    # Factor 4: Support/Resistance Levels (25 points)
    if current_price <= support * 1.02:
        score += 25
        factors.append(f"Near support level ₹{support} - good entry point")
    elif current_price >= resistance * 0.98:
        score -= 25
        factors.append(f"Near resistance level ₹{resistance} - consider selling")
    
    # Determine recommendation
    if score >= 40:
        recommendation = 'BUY'
        confidence = min(abs(score), 100)
        target_price = resistance
        reasoning = f"Strong buy signal. {', '.join(factors[:3])}"
    elif score <= -40:
        recommendation = 'SELL'
        confidence = min(abs(score), 100)
        target_price = support
        reasoning = f"Sell signal detected. {', '.join(factors[:3])}"
    else:
        recommendation = 'HOLD'
        confidence = 50
        target_price = current_price
        reasoning = f"Neutral market conditions. {', '.join(factors[:2]) if factors else 'Insufficient signals'}"
    
    return {
        'status': 'success',
        'recommendation': {
            'commodity': commodity,
            'recommendation': recommendation,
            'confidence': round(confidence, 1),
            'current_price': current_price,
            'target_price': round(target_price, 2),
            'reasoning': reasoning
        }
    }

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

def main():
    if not DB_URL:
        print("FATAL: DATABASE_URL not set")
        return

    # 1. Fetch Commodities
    commodities = []
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print("🔍 Fetching active commodity list from database...")
        cur.execute("SELECT DISTINCT commodity FROM market_prices ORDER BY commodity")
        rows = cur.fetchall()
        commodities = [row[0] for row in rows]
        conn.close()
        print(f"✅ Found {len(commodities)} active commodities.")
    except Exception as e:
        print(f"ERROR fetching commodities: {e}")
        return

    print(f"Analyzing {len(commodities)} commodities...\n")

    # 2. Process Loop
    for commodity in commodities:
        conn = None
        job_id = None
        try:
            conn = get_db_connection()
            if not conn: continue
           
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO agent_jobs (task_type, status, result_summary, command, created_at, updated_at)
                VALUES (%s, %s, %s, %s, NOW(), NOW())
                RETURNING id
            """, (f"Market Analysis: {commodity}", "PROCESSING", "Initializing...", "analysis"))
            job_id = cur.fetchone()[0]
            conn.commit()
            
            # Analyze
            analysis = analyze_commodity(commodity)
            
            if analysis['status'] == 'success':
                rec = analysis['recommendation']
                summary = f"Rec: {rec.get('recommendation')} | Conf: {rec.get('confidence')}%"
                
                cur.execute("""UPDATE agent_jobs SET status = 'COMPLETED', result_summary = %s, updated_at = NOW() WHERE id = %s""", (summary, job_id))
                
                # Insert insight with correct schema
                cur.execute("""
                    INSERT INTO market_insights 
                    (commodity, recommendation, current_price, target_price, confidence_score, ai_analysis, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, NOW())
                """, (
                    commodity, 
                    rec.get('recommendation'), 
                    rec.get('current_price', 0), 
                    rec.get('target_price', 0), 
                    rec.get('confidence', 0),
                    json.dumps({'reasoning': rec.get('reasoning', '')})
                ))
                
                print(f"✅ {commodity}: {rec.get('recommendation')} ({rec.get('confidence')}%)")
            else:
                cur.execute("""UPDATE agent_jobs SET status = 'FAILED', result_summary = %s, updated_at = NOW() WHERE id = %s""", (analysis.get('message'), job_id))
                print(f"❌ {commodity}: {analysis.get('message')}")
            
            conn.commit()

        except Exception as e:
            print(f"❌ Error processing {commodity}: {e}")
            if conn and job_id:
                try:
                    conn.rollback()
                    cur = conn.cursor()
                    cur.execute("UPDATE agent_jobs SET status = 'FAILED', result_summary = %s WHERE id = %s", (str(e), job_id))
                    conn.commit()
                except: pass
        finally:
            if conn: conn.close()
            import gc
            gc.collect()
            time.sleep(1)  # Rate limiting

    print("\n🎉 Analysis complete!")

if __name__ == "__main__":
    main()
