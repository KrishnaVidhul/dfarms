# D-Farms Market Intelligence System - Complete Guide

## Overview

The Market Intelligence system provides AI-powered commodity price analysis with multi-factor recommendations combining technical analysis and news sentiment.

---

## Quick Start

### 1. Fetch Production Data

```bash
cd /path/to/d_farms_core

# Set environment variables
export DATABASE_URL="postgresql://..."
export DATA_GOV_API_KEY="579b464db66ec23bdd0000015e444b28a9e7454e7778a5be3c0ebac5"

# Fetch latest market data
python3 src/scripts/fetch_production_data.py
```

### 2. Generate AI Insights

```bash
export GROQ_API_KEY="your_groq_api_key"

# Generate insights for all commodities
python3 src/agent_runtime/market_intel_agent.py
```

### 3. View Dashboard

Navigate to: `https://your-domain.com/app/market`

---

## System Architecture

### Components

1. **Data Fetcher** (`fetch_production_data.py`)
   - Fetches real commodity prices from data.gov.in API
   - Stores in `market_prices` table
   - Handles pagination (1000 records per request)

2. **AI Agent** (`market_intel_agent.py`)
   - Analyzes price trends (MA, momentum, volatility)
   - Analyzes news sentiment
   - Generates BUY/SELL/HOLD recommendations
   - Stores insights in `market_insights` table

3. **Frontend** (`/app/market`)
   - Displays price charts
   - Shows AI insights with multi-factor breakdown
   - Interactive filters (commodity, state, date range)

### Data Flow

```
data.gov.in API
    ↓
fetch_production_data.py
    ↓
market_prices table
    ↓
market_intel_agent.py
    ↓
market_insights table
    ↓
Frontend Dashboard
```

---

## Multi-Factor Analysis

### Factor Weights

| Factor | Weight | Status |
|--------|--------|--------|
| Technical Analysis | 70% | ✅ Active |
| News Sentiment | 30% | ✅ Active |
| Weather Forecast | 20% | 🔄 Planned |
| Yield Forecast | 15% | 🔄 Planned |
| Government Policy | 10% | 🔄 Planned |

### Recommendation Logic

**Combined Score** = (Technical × 0.7) + (News × 0.3)

**Thresholds:**
- BUY: Score ≥ +40
- SELL: Score ≤ -40
- HOLD: Score between -40 and +40

### Example Analysis

**Wheat:**
- Technical: +10 (stable, low volatility)
- News: +53 (positive - MSP increase, export demand)
- Combined: +23 → **HOLD** (below +40 threshold)

---

## Data Sources

### Primary: data.gov.in API

**Resource ID:** `35985678-0d79-46b4-9ed6-6f13308a1d24`  
**API Key:** Required (register at data.gov.in)  
**Rate Limit:** Free tier  
**Coverage:** 24 commodities, 24 states, 240 markets

**Fields:**
- State, District, Market
- Commodity, Variety, Grade
- Min_Price, Max_Price, Modal_Price
- Arrival_Date

### News Sources

**Current:** Google News RSS + keyword sentiment analysis  
**Future:** NewsAPI, PIB announcements

---

## Database Schema

### market_prices

```sql
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
```

### market_insights

```sql
CREATE TABLE market_insights (
    id SERIAL PRIMARY KEY,
    commodity VARCHAR(200) NOT NULL,
    recommendation VARCHAR(10),
    confidence_score DECIMAL(5,2),
    current_price DECIMAL(10,2),
    target_price DECIMAL(10,2),
    stop_loss DECIMAL(10,2),
    key_factors JSONB,
    technical_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    UNIQUE(commodity, DATE(created_at))
);
```

---

## Deployment

### Cloud VM Setup (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv postgresql-client

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages
pip install requests psycopg2-binary feedparser

# Set environment variables
export DATABASE_URL="postgresql://..."
export DATA_GOV_API_KEY="..."
export GROQ_API_KEY="..."
```

### Automated Data Refresh

Add to crontab:

```bash
# Fetch data every 6 hours
0 */6 * * * cd /path/to/d_farms_core && source venv/bin/activate && python3 src/scripts/fetch_production_data.py >> /var/log/market_fetch.log 2>&1

# Generate insights daily at 6 AM
0 6 * * * cd /path/to/d_farms_core && source venv/bin/activate && python3 src/agent_runtime/market_intel_agent.py >> /var/log/market_insights.log 2>&1
```

### Frontend Deployment (Cloud Run)

```bash
cd src/web

# Build and deploy
gcloud run deploy dfarms-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --clear-base-image
```

---

## API Endpoints

### GET /api/market

Fetch market price data with filters.

**Query Parameters:**
- `commodity` (optional)
- `state` (optional)
- `days` (optional, default: 30)

**Response:**
```json
{
  "prices": [...],
  "stats": {
    "total_commodities": 24,
    "total_states": 24,
    "total_markets": 240
  }
}
```

### GET /api/insights

Fetch AI insights for a commodity.

**Query Parameters:**
- `commodity` (required)

**Response:**
```json
{
  "commodity": "Wheat",
  "recommendation": "HOLD",
  "confidence_score": 50,
  "current_price": 2309.59,
  "target_price": 2309.59,
  "stop_loss": 2309.59,
  "multi_factor_analysis": {
    "technical_score": 10.0,
    "news_score": 53.3,
    "combined_score": 23.0
  },
  "news_sentiment": {
    "overall": "positive",
    "score": 53,
    "article_count": 3
  },
  "key_factors": [...]
}
```

---

## Troubleshooting

### No Insights Available

**Cause:** Insufficient recent price data (last 30 days)

**Solution:**
1. Run `fetch_production_data.py` to get latest data
2. Verify data exists: `SELECT COUNT(*) FROM market_prices WHERE commodity='...' AND arrival_date > NOW() - INTERVAL '30 days'`
3. If still no data, commodity may not have recent market activity

### API Timeout

**Cause:** data.gov.in API is slow/overloaded

**Solution:**
- Script automatically handles timeouts
- Fetches data in batches of 1000
- Retries on failure

### Frontend Not Updating

**Cause:** Stale cache or build needed

**Solution:**
```bash
cd src/web
npm run build
# Redeploy to Cloud Run
```

---

## Monitoring

### Key Metrics

1. **Data Freshness**
   ```sql
   SELECT commodity, MAX(arrival_date) as latest_date
   FROM market_prices
   GROUP BY commodity
   ORDER BY latest_date DESC;
   ```

2. **Insight Coverage**
   ```sql
   SELECT COUNT(DISTINCT commodity) as commodities_with_insights
   FROM market_insights
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

3. **Recommendation Distribution**
   ```sql
   SELECT recommendation, COUNT(*) as count
   FROM market_insights
   WHERE created_at > NOW() - INTERVAL '24 hours'
   GROUP BY recommendation;
   ```

---

## Future Enhancements

### Planned Features

1. **Weather Integration**
   - OpenWeatherMap API
   - Impact on crop yields
   - 20% weight in recommendations

2. **Yield Forecasts**
   - Ministry of Agriculture data
   - Production estimates
   - 15% weight

3. **Policy Tracking**
   - PIB announcements
   - MSP changes
   - Export/import restrictions
   - 10% weight

4. **Historical Accuracy**
   - Track recommendation performance
   - Adjust weights based on accuracy
   - Display accuracy metrics

---

## Support

For issues or questions:
1. Check logs: `/var/log/market_fetch.log`, `/var/log/market_insights.log`
2. Verify environment variables are set
3. Test API connectivity: `curl "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=YOUR_KEY&format=json&limit=1"`

---

## File Reference

### Essential Scripts

- `src/scripts/fetch_production_data.py` - Data fetcher (KEEP)
- `src/agent_runtime/market_intel_agent.py` - AI agent (KEEP)
- `src/agent_runtime/tools/market_analysis_tools.py` - Analysis logic (KEEP)
- `src/agent_runtime/tools/news_analysis_tools.py` - News sentiment (KEEP)

### Frontend Components

- `src/web/app/(internal)/app/market/page.tsx` - Main dashboard
- `src/web/components/market/AIInsights.tsx` - AI insights display
- `src/web/components/market/PriceTrendChart.tsx` - Price charts
- `src/web/components/market/MarketFilters.tsx` - Filter controls

---

## Version History

- **v1.0** - Basic price display
- **v2.0** - Technical analysis
- **v3.0** - Multi-factor analysis with news sentiment
- **v4.0** (Planned) - Weather, yield, policy integration
