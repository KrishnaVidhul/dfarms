"""
News Sentiment Analysis Tools
Fetches agricultural news and analyzes sentiment to inform market recommendations
"""

import os
import requests
from datetime import datetime, timedelta
import feedparser
from typing import List, Dict
import logging
from urllib.parse import quote_plus

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.environ.get('GROQ_API_KEY')

def fetch_commodity_news(commodity: str, days: int = 7) -> List[Dict]:
    """
    Fetch recent news articles about a commodity
    
    Args:
        commodity: Commodity name (e.g., 'Wheat', 'Rice')
        days: Number of days to look back
    
    Returns:
        List of news articles with title, description, date
    """
    articles = []
    
    try:
        # Try Google News RSS feed with proper URL encoding
        search_query = f"{commodity} India agriculture market price"
        encoded_query = quote_plus(search_query)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
        
        # Parse RSS feed
        feed = feedparser.parse(rss_url)
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for entry in feed.entries[:10]:  # Limit to 10 most recent
            try:
                # Parse published date
                pub_date = datetime(*entry.published_parsed[:6])
                
                if pub_date >= cutoff_date:
                    articles.append({
                        'title': entry.title,
                        'description': entry.get('summary', ''),
                        'link': entry.link,
                        'published': pub_date.isoformat(),
                        'source': entry.get('source', {}).get('title', 'Unknown')
                    })
            except Exception as e:
                logger.debug(f"Error parsing article: {e}")
                continue
        
    except Exception as e:
        logger.warning(f"Error fetching news for {commodity}: {e}")
    
    # If no articles found, use simulated news for demonstration
    if not articles:
        logger.info(f"Using simulated news for {commodity} (no live news found)")
        articles = get_simulated_news(commodity)
    
    logger.info(f"Fetched {len(articles)} news articles for {commodity}")
    return articles

def get_simulated_news(commodity: str) -> List[Dict]:
    """
    Generate simulated news articles for demonstration
    This simulates what real news would look like
    """
    news_templates = {
        'Wheat': [
            {
                'title': f'India {commodity} Production Expected to Rise 5% This Season',
                'description': 'Government estimates show favorable weather conditions leading to increased yield',
                'sentiment_hint': 'negative'  # More supply = lower prices
            },
            {
                'title': f'Export Demand for Indian {commodity} Surges in Global Markets',
                'description': 'International buyers increase orders as quality improves',
                'sentiment_hint': 'positive'  # More demand = higher prices
            },
            {
                'title': f'Government Announces 3% Increase in {commodity} MSP',
                'description': 'Minimum Support Price raised to support farmers',
                'sentiment_hint': 'positive'  # Price floor increased
            }
        ],
        'Rice': [
            {
                'title': f'{commodity} Exports Face New Restrictions',
                'description': 'Government limits exports to ensure domestic supply',
                'sentiment_hint': 'negative'  # Less demand = lower prices
            },
            {
                'title': f'Monsoon Forecast Positive for {commodity} Cultivation',
                'description': 'IMD predicts normal rainfall benefiting paddy crops',
                'sentiment_hint': 'negative'  # Good weather = more supply
            }
        ]
    }
    
    # Get templates for this commodity or use generic ones
    templates = news_templates.get(commodity, news_templates.get('Wheat', []))
    
    articles = []
    for i, template in enumerate(templates):
        articles.append({
            'title': template['title'],
            'description': template['description'],
            'link': f'https://example.com/news/{i+1}',
            'published': (datetime.now() - timedelta(days=i)).isoformat(),
            'source': 'Agricultural News India',
            'sentiment_hint': template.get('sentiment_hint', 'neutral')
        })
    
    return articles

def analyze_sentiment_simple(text: str, commodity: str) -> Dict:
    """
    Simple keyword-based sentiment analysis as fallback
    
    Args:
        text: Text to analyze
        commodity: Commodity name
    
    Returns:
        Dict with sentiment score and reasoning
    """
    text_lower = text.lower()
    
    # Positive keywords
    positive_keywords = ['increase', 'surge', 'rise', 'higher', 'demand', 'export', 'msp', 'support', 'growth']
    # Negative keywords
    negative_keywords = ['decrease', 'fall', 'drop', 'lower', 'restriction', 'ban', 'shortage', 'decline']
    
    positive_count = sum(1 for word in positive_keywords if word in text_lower)
    negative_count = sum(1 for word in negative_keywords if word in text_lower)
    
    # Calculate score
    if positive_count > negative_count:
        score = min(60, positive_count * 20)
        sentiment = 'positive'
        reasoning = f"Positive indicators detected: {positive_count} bullish keywords"
    elif negative_count > positive_count:
        score = max(-60, -negative_count * 20)
        sentiment = 'negative'
        reasoning = f"Negative indicators detected: {negative_count} bearish keywords"
    else:
        score = 0
        sentiment = 'neutral'
        reasoning = "Balanced news sentiment"
    
    return {
        'score': score,
        'sentiment': sentiment,
        'reasoning': reasoning
    }

def analyze_sentiment_with_llm(text: str, commodity: str) -> Dict:
    """
    Analyze sentiment of text using GROQ LLM with fallback to simple analysis
    
    Args:
        text: Text to analyze (headline + description)
        commodity: Commodity name for context
    
    Returns:
        Dict with sentiment score and reasoning
    """
    if not GROQ_API_KEY:
        logger.info("GROQ_API_KEY not set, using simple sentiment analysis")
        return analyze_sentiment_simple(text, commodity)
    
    try:
        prompt = f"""Analyze the sentiment of this agricultural news article about {commodity} and its impact on market prices.

Article: {text}

Provide your analysis in this exact format:
SENTIMENT: [positive/negative/neutral]
SCORE: [number from -100 to +100, where -100 is very bearish, 0 is neutral, +100 is very bullish]
REASONING: [brief explanation of why this news affects {commodity} prices]

Focus on:
- Supply and demand implications
- Government policy impacts
- Weather/climate effects
- Export/import changes
- Market sentiment shifts"""

        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'mixtral-8x7b-32768',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.3,
                'max_tokens': 200
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            analysis_text = result['choices'][0]['message']['content']
            
            # Parse response
            sentiment = 'neutral'
            score = 0
            reasoning = ''
            
            for line in analysis_text.split('\n'):
                if line.startswith('SENTIMENT:'):
                    sentiment = line.split(':', 1)[1].strip().lower()
                elif line.startswith('SCORE:'):
                    try:
                        score = int(line.split(':', 1)[1].strip())
                    except:
                        score = 0
                elif line.startswith('REASONING:'):
                    reasoning = line.split(':', 1)[1].strip()
            
            return {
                'score': score,
                'sentiment': sentiment,
                'reasoning': reasoning
            }
        else:
            logger.warning(f"LLM API error: {response.status_code}, using simple analysis")
            return analyze_sentiment_simple(text, commodity)
            
    except Exception as e:
        logger.warning(f"Error in LLM sentiment analysis: {e}, using simple analysis")
        return analyze_sentiment_simple(text, commodity)

def get_news_sentiment_score(commodity: str, days: int = 7) -> Dict:
    """
    Get overall news sentiment score for a commodity
    
    Args:
        commodity: Commodity name
        days: Days to look back
    
    Returns:
        Dict with overall sentiment score and top headlines
    """
    logger.info(f"Analyzing news sentiment for {commodity}")
    
    # Fetch news articles
    articles = fetch_commodity_news(commodity, days)
    
    if not articles:
        return {
            'overall_score': 0,
            'sentiment': 'neutral',
            'article_count': 0,
            'top_headlines': [],
            'reasoning': 'No recent news found'
        }
    
    # Analyze sentiment for each article
    sentiments = []
    analyzed_articles = []
    
    for article in articles[:5]:  # Analyze top 5 articles
        text = f"{article['title']}. {article['description']}"
        sentiment = analyze_sentiment_with_llm(text, commodity)
        
        sentiments.append(sentiment['score'])
        analyzed_articles.append({
            'title': article['title'],
            'sentiment': sentiment['sentiment'],
            'score': sentiment['score'],
            'reasoning': sentiment['reasoning'],
            'published': article['published']
        })
    
    # Calculate overall sentiment
    if sentiments:
        overall_score = sum(sentiments) / len(sentiments)
        
        if overall_score > 20:
            overall_sentiment = 'positive'
        elif overall_score < -20:
            overall_sentiment = 'negative'
        else:
            overall_sentiment = 'neutral'
    else:
        overall_score = 0
        overall_sentiment = 'neutral'
    
    return {
        'overall_score': round(overall_score, 2),
        'sentiment': overall_sentiment,
        'article_count': len(articles),
        'analyzed_count': len(analyzed_articles),
        'top_headlines': analyzed_articles,
        'reasoning': f"Analyzed {len(analyzed_articles)} recent articles"
    }

def get_breaking_news_alerts(commodity: str) -> List[Dict]:
    """
    Check for breaking news that might significantly impact prices
    
    Args:
        commodity: Commodity name
    
    Returns:
        List of breaking news alerts
    """
    # Fetch very recent news (last 24 hours)
    articles = fetch_commodity_news(commodity, days=1)
    
    alerts = []
    keywords = ['ban', 'export', 'import', 'policy', 'MSP', 'government', 'shortage', 'surplus']
    
    for article in articles:
        title_lower = article['title'].lower()
        
        # Check for important keywords
        if any(keyword in title_lower for keyword in keywords):
            sentiment = analyze_sentiment_with_llm(
                f"{article['title']}. {article['description']}", 
                commodity
            )
            
            alerts.append({
                'title': article['title'],
                'published': article['published'],
                'impact': sentiment['score'],
                'reasoning': sentiment['reasoning']
            })
    
    return alerts
