"""
Market Analysis Tools for AI Agent
Provides technical analysis functions for commodity price data
"""

import os
import psycopg2
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import statistics

DB_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    """Get database connection"""
    if not DB_URL:
        raise ValueError("DATABASE_URL not set")
    return psycopg2.connect(DB_URL)

def get_price_history(commodity: str, days: int = 30) -> List[Dict]:
    """
    Get historical price data for a commodity
    
    Args:
        commodity: Commodity name
        days: Number of days of history
    
    Returns:
        List of price records with dates and prices
    """
    conn = get_db_connection()
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
    
    cursor.close()
    conn.close()
    
    return [
        {
            'date': row[0],
            'price': float(row[1]) if row[1] else 0,
            'min_price': float(row[2]) if row[2] else 0,
            'max_price': float(row[3]) if row[3] else 0,
            'market_count': int(row[4])
        }
        for row in results
    ]

def calculate_moving_average(prices: List[float], window: int) -> Optional[float]:
    """Calculate moving average"""
    if len(prices) < window:
        return None
    return statistics.mean(prices[-window:])

def calculate_volatility(prices: List[float]) -> float:
    """Calculate price volatility (standard deviation)"""
    if len(prices) < 2:
        return 0.0
    return statistics.stdev(prices)

def calculate_momentum(prices: List[float], period: int = 7) -> Optional[float]:
    """
    Calculate price momentum (rate of change)
    
    Returns:
        Percentage change over period
    """
    if len(prices) < period + 1:
        return None
    
    current_price = prices[-1]
    past_price = prices[-period-1]
    
    if past_price == 0:
        return None
    
    return ((current_price - past_price) / past_price) * 100

def detect_trend(prices: List[float]) -> str:
    """
    Detect price trend
    
    Returns:
        'UPTREND', 'DOWNTREND', or 'SIDEWAYS'
    """
    if len(prices) < 5:
        return 'INSUFFICIENT_DATA'
    
    # Calculate short and long moving averages
    short_ma = calculate_moving_average(prices, 5)
    long_ma = calculate_moving_average(prices, 10) if len(prices) >= 10 else short_ma
    
    if short_ma is None or long_ma is None:
        return 'INSUFFICIENT_DATA'
    
    if short_ma > long_ma * 1.02:  # 2% threshold
        return 'UPTREND'
    elif short_ma < long_ma * 0.98:
        return 'DOWNTREND'
    else:
        return 'SIDEWAYS'

def calculate_support_resistance(prices: List[float]) -> Dict[str, float]:
    """
    Calculate support and resistance levels
    
    Returns:
        Dict with 'support' and 'resistance' levels
    """
    if len(prices) < 10:
        return {'support': min(prices), 'resistance': max(prices)}
    
    # Simple approach: use recent min/max
    recent_prices = prices[-10:]
    
    return {
        'support': min(recent_prices),
        'resistance': max(recent_prices)
    }

def analyze_price_trends(commodity: str, days: int = 30) -> Dict:
    """
    Comprehensive price trend analysis
    
    Args:
        commodity: Commodity name
        days: Days of history to analyze
    
    Returns:
        Dict with analysis results
    """
    history = get_price_history(commodity, days)
    
    if not history:
        return {
            'error': 'No price data available',
            'commodity': commodity
        }
    
    prices = [h['price'] for h in history if h['price'] > 0]
    
    if len(prices) < 5:
        return {
            'error': 'Insufficient data for analysis',
            'commodity': commodity,
            'data_points': len(prices)
        }
    
    current_price = prices[-1]
    ma_7 = calculate_moving_average(prices, 7)
    ma_30 = calculate_moving_average(prices, 30) if len(prices) >= 30 else ma_7
    volatility = calculate_volatility(prices)
    momentum = calculate_momentum(prices, 7)
    trend = detect_trend(prices)
    levels = calculate_support_resistance(prices)
    
    # Calculate price change
    if len(prices) >= 2:
        price_change = ((prices[-1] - prices[0]) / prices[0]) * 100
    else:
        price_change = 0
    
    return {
        'commodity': commodity,
        'current_price': round(current_price, 2),
        'ma_7': round(ma_7, 2) if ma_7 else None,
        'ma_30': round(ma_30, 2) if ma_30 else None,
        'volatility': round(volatility, 2),
        'momentum': round(momentum, 2) if momentum else None,
        'trend': trend,
        'support': round(levels['support'], 2),
        'resistance': round(levels['resistance'], 2),
        'price_change_pct': round(price_change, 2),
        'data_points': len(prices),
        'analysis_date': datetime.now().isoformat()
    }

def generate_buy_sell_signal(commodity: str, include_news: bool = True) -> Dict:
    """
    Generate buy/sell recommendation based on multi-factor analysis
    
    Args:
        commodity: Commodity name
        include_news: Whether to include news sentiment analysis
    
    Returns:
        Dict with recommendation, confidence, and reasoning
    """
    analysis = analyze_price_trends(commodity)
    
    if 'error' in analysis:
        return {
            'commodity': commodity,
            'recommendation': 'HOLD',
            'confidence': 0,
            'reason': analysis['error']
        }
    
    # Extract technical indicators
    current_price = analysis['current_price']
    ma_7 = analysis['ma_7']
    ma_30 = analysis['ma_30']
    momentum = analysis['momentum']
    volatility = analysis['volatility']
    trend = analysis['trend']
    support = analysis['support']
    resistance = analysis['resistance']
    
    # Technical Analysis Scoring (70% weight if news included, 100% otherwise)
    technical_score = 0
    technical_factors = []
    
    # Factor 1: Price vs Moving Averages
    if ma_7 and ma_30:
        if current_price < ma_30 * 0.95:  # 5% below 30-day MA
            technical_score += 30
            technical_factors.append("Price significantly below 30-day average")
        elif current_price > ma_30 * 1.05:  # 5% above 30-day MA
            technical_score -= 30
            technical_factors.append("Price significantly above 30-day average")
    
    # Factor 2: Momentum
    if momentum:
        if momentum > 5:  # Strong positive momentum
            technical_score += 20
            technical_factors.append(f"Strong positive momentum (+{momentum:.1f}%)")
        elif momentum < -5:  # Strong negative momentum
            technical_score -= 20
            technical_factors.append(f"Strong negative momentum ({momentum:.1f}%)")
    
    # Factor 3: Trend
    if trend == 'UPTREND':
        technical_score += 15
        technical_factors.append("Upward price trend detected")
    elif trend == 'DOWNTREND':
        technical_score -= 15
        technical_factors.append("Downward price trend detected")
    
    # Factor 4: Volatility (high volatility = risky)
    avg_price = (support + resistance) / 2
    volatility_pct = (volatility / avg_price) * 100 if avg_price > 0 else 0
    
    if volatility_pct > 10:  # High volatility
        technical_score -= 10
        technical_factors.append(f"High price volatility ({volatility_pct:.1f}%)")
    elif volatility_pct < 3:  # Low volatility
        technical_score += 10
        technical_factors.append("Low price volatility (stable market)")
    
    # Factor 5: Support/Resistance
    if current_price <= support * 1.02:  # Near support
        technical_score += 25
        technical_factors.append("Price near support level (good entry point)")
    elif current_price >= resistance * 0.98:  # Near resistance
        technical_score -= 25
        technical_factors.append("Price near resistance level (consider selling)")
    
    # News Sentiment Analysis (30% weight)
    news_score = 0
    news_factors = []
    news_sentiment_data = None
    
    if include_news:
        try:
            from agent_runtime.tools.news_analysis_tools import get_news_sentiment_score
            news_sentiment_data = get_news_sentiment_score(commodity, days=7)
            
            if news_sentiment_data and news_sentiment_data.get('overall_score') != 0:
                news_score = news_sentiment_data['overall_score']
                news_factors.append(f"News sentiment: {news_sentiment_data['sentiment']} ({news_score:+.0f})")
                
                # Add top headline as factor
                if news_sentiment_data.get('top_headlines'):
                    top_headline = news_sentiment_data['top_headlines'][0]
                    news_factors.append(f"Latest: {top_headline['title'][:60]}...")
        except Exception as e:
            logger.warning(f"Could not fetch news sentiment: {e}")
    
    # Combined Multi-Factor Score
    if include_news and news_score != 0:
        # Weighted average: 70% technical, 30% news
        combined_score = (technical_score * 0.7) + (news_score * 0.3)
        all_factors = technical_factors + news_factors
    else:
        combined_score = technical_score
        all_factors = technical_factors
    
    # Determine recommendation based on combined score
    if combined_score >= 40:  # Strong buy signal
        recommendation = 'BUY'
        confidence = min(abs(combined_score), 100)
        target_price = resistance
        stop_loss = support
    elif combined_score <= -40:  # Strong sell signal
        recommendation = 'SELL'
        confidence = min(abs(combined_score), 100)
        target_price = support
        stop_loss = resistance
    else:  # Neutral/hold
        recommendation = 'HOLD'
        confidence = 50
        target_price = current_price
        stop_loss = current_price
    
    result = {
        'commodity': commodity,
        'recommendation': recommendation,
        'confidence': round(confidence, 1),
        'current_price': current_price,
        'target_price': round(target_price, 2),
        'stop_loss': round(stop_loss, 2),
        'key_factors': all_factors,
        'technical_data': {
            'ma_7': ma_7,
            'ma_30': ma_30,
            'momentum': momentum,
            'volatility': round(volatility, 2),
            'trend': trend
        },
        'generated_at': datetime.now().isoformat()
    }
    
    # Add multi-factor breakdown if news was included
    if include_news:
        result['multi_factor_analysis'] = {
            'technical_score': round(technical_score, 1),
            'news_score': round(news_score, 1),
            'combined_score': round(combined_score, 1),
            'weights': {'technical': 0.7, 'news': 0.3}
        }
        
        if news_sentiment_data:
            result['news_sentiment'] = {
                'overall': news_sentiment_data['sentiment'],
                'score': news_sentiment_data['overall_score'],
                'article_count': news_sentiment_data.get('article_count', 0)
            }
    
    return result

def compare_state_prices(commodity: str) -> List[Dict]:
    """
    Compare prices across different states
    
    Returns:
        List of states with average prices, sorted by price
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT 
            state,
            AVG(modal_price) as avg_price,
            COUNT(DISTINCT market_name) as market_count,
            MAX(arrival_date) as latest_date
        FROM market_prices
        WHERE commodity ILIKE %s
            AND arrival_date >= CURRENT_DATE - INTERVAL '7 days'
            AND modal_price IS NOT NULL
        GROUP BY state
        ORDER BY avg_price ASC
    """
    
    cursor.execute(query, (f'%{commodity}%',))
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return [
        {
            'state': row[0],
            'avg_price': round(float(row[1]), 2) if row[1] else 0,
            'market_count': int(row[2]),
            'latest_date': row[3].isoformat() if row[3] else None
        }
        for row in results
    ]
