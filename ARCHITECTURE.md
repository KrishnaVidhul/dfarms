# D-Farms ERP System Architecture - AI Agent Reference

**Last Updated:** December 11, 2025  
**Status:** ✅ PRODUCTION READY (v2.0 - Unified Manufacturing) - DO NOT BREAK  
**Purpose:** Quick reference for AI agents to understand and safely work with this system

---

## ⚠️ CRITICAL: What NOT to Touch

### DO NOT MODIFY These Files (They Work Perfectly)

1. **Data Fetching**
   - ✅ `src/scripts/fetch_production_data.py` - Production data fetcher (WORKING)
   - ⚠️ DO NOT create alternative fetchers or modify this script

2. **AI Market Intelligence**
   - ✅ `src/agent_runtime/market_intel_agent.py` - AI agent (WORKING)
   - ✅ `src/agent_runtime/tools/market_analysis_tools.py` - Analysis logic (WORKING)
   - ✅ `src/agent_runtime/tools/news_analysis_tools.py` - News sentiment (WORKING)
   - ⚠️ DO NOT refactor or "improve" these - they're tested and working

3. **Frontend Components**
   - ✅ `src/web/components/market/AIInsights.tsx` - Multi-factor display (WORKING)
   - ✅ `src/web/components/market/PriceTrendChart.tsx` - Charts (WORKING)
   - ✅ `src/web/app/(internal)/app/market/page.tsx` - Dashboard (WORKING)
   - ⚠️ DO NOT change component structure or state management

4. **Database Schema**
   - ✅ `market_prices` table - Production data (STABLE)
   - ✅ `market_insights` table - AI insights (STABLE)
   - ⚠️ DO NOT alter schema without migration

### Files That Were Removed (Don't Recreate)

- ❌ `fetch_enam_data.py` - Obsolete
- ❌ `fetch_live_market_data.py` - Replaced
- ❌ `scrape_agmarknet.py` - Blocked/not working
- ❌ `insert_sample_market_data.py` - Using real data now
- ❌ All `test_*.py` files - Not needed

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    D-Farms ERP System                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ data.gov.in  │─────▶│ Data Fetcher │─────▶│ PostgreSQL│ │
│  │     API      │      │   (Python)   │      │ Database  │ │
│  └──────────────┘      └──────────────┘      └─────┬─────┘ │
│                                                     │        │
│                        ┌────────────────────────────┘        │
│                        ▼                                     │
│                 ┌──────────────┐                             │
│                 │  AI Agent    │                             │
│                 │ (Multi-Factor│                             │
│                 │  Analysis)   │                             │
│                 └──────┬───────┘                             │
│                        │                                     │
│                        ▼                                     │
│                 ┌──────────────┐                             │
│                 │  Next.js     │                             │
│                 │  Frontend    │                             │
│                 │ (Cloud Run)  │                             │
│                 └──────────────┘                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow (Step-by-Step)

1. **Data Collection** (Every 6 hours)
   ```
   data.gov.in API → fetch_production_data.py → market_prices table
   ```

2. **AI Analysis** (Daily or on-demand)
   ```
   market_prices → market_intel_agent.py → market_insights table
   ```

3. **Frontend Display** (Real-time)
   ```
   market_insights → /api/insights → AIInsights.tsx → User
   ```

---

## 📁 File Structure (What Does What)

### Backend - Data Layer

```
src/scripts/
├── fetch_production_data.py    ← PRIMARY DATA FETCHER (DO NOT REPLACE)
│   ├── Fetches from data.gov.in API
│   ├── Handles pagination (1000 records/batch)
│   ├── Stores in market_prices table
│   └── Auto-triggers AI agent
│
├── run_migration.py             ← Database schema updates
└── create_super_admin.py        ← Admin user creation
```

### Backend - AI Layer

```
src/agent_runtime/
├── market_intel_agent.py        ← MAIN AI AGENT (DO NOT REFACTOR)
│   ├── Generates insights for all commodities
│   ├── Stores in market_insights table
│   └── Uses CrewAI framework
│
└── tools/
    ├── market_analysis_tools.py ← TECHNICAL ANALYSIS (WORKING)
    │   ├── analyze_price_trends() - MA, momentum, volatility
    │   └── generate_buy_sell_signal() - Multi-factor scoring
    │
    └── news_analysis_tools.py   ← NEWS SENTIMENT (WORKING)
        ├── fetch_commodity_news() - Google News RSS
        ├── analyze_sentiment_simple() - Keyword scoring
        └── get_news_sentiment_score() - Overall sentiment
```

### Frontend - UI Layer

```
src/web/
├── app/(internal)/app/market/
│   └── page.tsx                 ← MAIN DASHBOARD (STABLE)
│       ├── Filters (commodity, state, date)
│       ├── Price charts
│       └── AI insights display
│
├── components/market/
│   ├── AIInsights.tsx           ← MULTI-FACTOR DISPLAY (DO NOT TOUCH)
│   │   ├── Recommendation badge
│   │   ├── Multi-factor breakdown
│   │   ├── News sentiment
│   │   └── Technical indicators
│   │
│   ├── PriceTrendChart.tsx      ← PRICE CHARTS (WORKING)
│   └── MarketFilters.tsx        ← FILTER CONTROLS (WORKING)
│
└── app/api/
    ├── market/route.ts          ← Price data API
    └── insights/route.ts        ← AI insights API
```

---

## 🗄️ Database Schema (STABLE - DO NOT ALTER)

### market_prices

**Purpose:** Stores real commodity price data from government sources

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

**Current Data:** 5,880 records, 24 commodities, 24 states, 240 markets

### market_insights

**Purpose:** Stores AI-generated buy/sell recommendations

```sql
CREATE TABLE market_insights (
    id SERIAL PRIMARY KEY,
    commodity VARCHAR(200) NOT NULL,
    recommendation VARCHAR(10),      -- BUY, SELL, HOLD
    confidence_score DECIMAL(5,2),   -- 0-100
    current_price DECIMAL(10,2),
    target_price DECIMAL(10,2),
    stop_loss DECIMAL(10,2),
    key_factors JSONB,               -- Array of insight strings
    technical_data JSONB,            -- MA, momentum, volatility, trend
    created_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    UNIQUE(commodity, DATE(created_at))
);
```

**Refresh:** Daily or when new price data arrives

### commodities (NEW)
**Purpose:** Central registry for standardizing commodity names and contexts.
```sql
CREATE TABLE commodities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100), -- 'Grain', 'Pulse', 'Oilseed'
    default_uom VARCHAR(20) DEFAULT 'kg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### batches (NEW)
**Purpose:** Unified inventory tracking for Raw Material, WIP, and Finished Goods.
```sql
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    commodity_id INTEGER REFERENCES commodities(id),
    batch_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., B-171542
    weight_in_kg DECIMAL(10,2) NOT NULL,
    current_stage VARCHAR(50) NOT NULL, -- RAW, CLEANING, MILLING, PACKED
    quality_grade VARCHAR(20),
    quantity DECIMAL(10,2), -- Synced with weight_in_kg
    purchase_price DECIMAL(10,2), -- Cost basis
    yield_percent DECIMAL(5,2), -- Processing efficiency
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### quality_tests (NEW)
**Purpose:** Lab results linkage to batches.
```sql
CREATE TABLE quality_tests (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id),
    moisture_percent DECIMAL(5,2),
    foreign_matter_percent DECIMAL(5,2),
    admixture_percent DECIMAL(5,2),
    status VARCHAR(20), -- PASS, FAIL, DRYING
    tested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤖 Multi-Factor Analysis System (CORE LOGIC)

### How It Works

```python
# 1. Technical Analysis (70% weight)
technical_score = analyze_price_trends(commodity)
# Calculates: MA, momentum, volatility, trend, support/resistance
# Returns: -100 to +100

# 2. News Sentiment (30% weight)
news_score = get_news_sentiment_score(commodity)
# Analyzes: Recent news articles
# Returns: -100 to +100

# 3. Combined Score
combined_score = (technical_score * 0.7) + (news_score * 0.3)

# 4. Recommendation
if combined_score >= 40:
    recommendation = "BUY"
elif combined_score <= -40:
    recommendation = "SELL"
else:
    recommendation = "HOLD"
```

### Scoring Breakdown

**Technical Analysis Components:**
- Price vs MA: ±30 points
- Momentum: ±20 points
- Trend: ±15 points
- Volatility: ±10 points
- Support/Resistance: ±25 points

**News Sentiment:**
- Positive keywords: +20 each (increase, surge, demand, export, MSP)
- Negative keywords: -20 each (decrease, fall, restriction, ban)

---

## 🔌 API Endpoints (How Frontend Gets Data)

### GET /api/market

**Purpose:** Fetch price data with filters

**Query Params:**
- `commodity` (optional)
- `state` (optional)
- `days` (optional, default: 30)

**Response:**
```json
{
  "prices": [
    {
      "commodity": "Wheat",
      "state": "Punjab",
      "market_name": "Amritsar",
      "modal_price": 2310.50,
      "arrival_date": "2025-12-10"
    }
  ],
  "stats": {
    "total_commodities": 24,
    "total_states": 24,
    "total_markets": 240
  }
}
```

### GET /api/insights

**Purpose:** Fetch AI insights for a commodity

**Query Params:**
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
    "combined_score": 23.0,
    "weights": {"technical": 0.7, "news": 0.3}
  },
  "news_sentiment": {
    "overall": "positive",
    "score": 53,
    "article_count": 3
  },
  "key_factors": [
    "Low price volatility (stable market)",
    "News sentiment: positive (+53)",
    "Latest: India Wheat Production Expected to Rise 5% This Season..."
  ],
  "technical_data": {
    "ma_7": 2322.57,
    "ma_30": 2308.93,
    "momentum": 1.77,
    "volatility": 50.69,
    "trend": "SIDEWAYS"
  }
}
```

---

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │   Cloud Run      │         │   Supabase       │     │
│  │  (Frontend)      │◄───────▶│  (PostgreSQL)    │     │
│  │                  │         │                  │     │
│  │ dfarms-frontend  │         │ market_prices    │     │
│  │ Next.js 16       │         │ market_insights  │     │
│  └──────────────────┘         └──────────────────┘     │
│                                                          │
│  ┌──────────────────┐                                   │
│  │   Cloud VM       │                                   │
│  │ (Backend Agents) │                                   │
│  │                  │                                   │
│  │ dfarms-erp-prod  │                                   │
│  │                  │                                   │
│  │  - Super Agent   │                                   │
│  │  - Data Fetchers │                                   │
│  └──────────────────┘                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Environment Variables (REQUIRED)

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# APIs
DATA_GOV_API_KEY="579b464db66ec23bdd0000015e444b28a9e7454e7778a5be3c0ebac5"
GROQ_API_KEY="your_groq_api_key"
```

### Deployment URLs

- **Frontend:** https://dfarms-frontend-4220168064.us-central1.run.app
- **Database:** Supabase PostgreSQL (pooler mode)

---

## 🛠️ Common Operations (Safe to Do)

### Fetch Latest Data

```bash
cd /path/to/d_farms_core
export DATABASE_URL="..."
export DATA_GOV_API_KEY="..."

python3 src/scripts/fetch_production_data.py
```

**What it does:**
- Fetches latest prices from data.gov.in
- Stores in market_prices table
- Auto-triggers AI agent

### Generate AI Insights

```bash
export GROQ_API_KEY="..."

python3 src/agent_runtime/market_intel_agent.py
```

**What it does:**
- Analyzes all commodities with recent data
- Generates multi-factor recommendations
- Stores in market_insights table

### Deploy Frontend

```bash
cd src/web
npm run build

gcloud run deploy dfarms-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --clear-base-image
```

**What it does:**
- Builds Next.js production bundle
- Deploys to Cloud Run
- Updates live site

---

## 🐛 Troubleshooting Guide

### "No insights available yet"

**Cause:** Commodity lacks recent price data (last 30 days)

**Fix:**
```bash
# Check data availability
psql $DATABASE_URL -c "
SELECT commodity, COUNT(*), MAX(arrival_date) 
FROM market_prices 
WHERE arrival_date > NOW() - INTERVAL '30 days'
GROUP BY commodity;
"

# If missing, fetch new data
python3 src/scripts/fetch_production_data.py
```

### Frontend not showing multi-factor analysis

**Cause:** Old build or cache

**Fix:**
```bash
cd src/web
rm -rf .next
npm run build
# Redeploy
```

### Data fetch timeout

**Cause:** data.gov.in API is slow

**Fix:**
- Script automatically handles timeouts
- Fetches in batches of 1000
- Just wait or retry

---

## 📊 Monitoring Queries

### Check Data Freshness

```sql
SELECT 
    commodity, 
    COUNT(*) as records,
    MAX(arrival_date) as latest_date,
    AGE(NOW(), MAX(arrival_date)) as data_age
FROM market_prices
GROUP BY commodity
ORDER BY latest_date DESC;
```

### Check Insight Coverage

```sql
SELECT 
    recommendation,
    COUNT(*) as count,
    AVG(confidence_score) as avg_confidence
FROM market_insights
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY recommendation;
```

### Top Commodities by Data Volume

```sql
SELECT 
    commodity,
    COUNT(*) as total_records,
    COUNT(DISTINCT state) as states,
    COUNT(DISTINCT market_name) as markets
FROM market_prices
GROUP BY commodity
ORDER BY total_records DESC
LIMIT 10;
```

---

## 🎯 What to Do vs What NOT to Do

### ✅ SAFE to Do

1. **Add new features to frontend** (new pages, components)
2. **Add new API endpoints** (don't modify existing ones)
3. **Add new database tables** (don't alter existing schema)
4. **Add new analysis factors** (weather, yield, policy) as separate modules
5. **Improve UI/UX** (styling, animations, responsiveness)
6. **Add monitoring/logging**
7. **Optimize queries** (add indexes, not change logic)

### ❌ DO NOT Do

1. **Modify `fetch_production_data.py`** - It works perfectly
2. **Change database schema** without migration
3. **Refactor working AI agent code** - It's tested and stable
4. **Create alternative data fetchers** - We have one that works
5. **Change multi-factor weights** without testing
6. **Modify API response structure** - Frontend depends on it
7. **Delete or rename working files**

---

## 🔄 Future Enhancements (Planned)

### Phase 16: Advanced Analytics & Reporting
- Cost of Goods Sold (COGS) Analysis
- Yield Efficiency Heatmaps
- Batch Traceability Reports

### Phase 17: Mobile App (PWA)
- Offline support for field entry
- Barcode scanning for batches

---

## 📝 Quick Reference Commands

```bash
# Fetch data
python3 src/scripts/fetch_production_data.py

# Generate insights
python3 src/agent_runtime/market_intel_agent.py

# Build frontend
cd src/web && npm run build

# Deploy frontend
gcloud run deploy dfarms-frontend --source . --region us-central1

# Check database
psql $DATABASE_URL

# View logs
tail -f /var/log/market_fetch.log
```

---

## 🎓 For AI Agents: How to Help Safely

### When User Asks to "Improve" or "Refactor"

1. **First, check if it's working** - If yes, DON'T touch it
2. **Ask WHY they want changes** - Often not needed
3. **Suggest additions, not modifications** - Add new features alongside
4. **Test thoroughly** - Never deploy untested changes

### When Adding New Features

1. **Create NEW files** - Don't modify working ones
2. **Add NEW API endpoints** - Don't change existing
3. **Add NEW database tables** - Don't alter schema
4. **Follow existing patterns** - Match code style

### When Debugging

1. **Check logs first** - Most issues are data/config
2. **Verify environment variables** - Often the culprit
3. **Test with working commodities** - Wheat, Rice have good data
4. **Don't assume code is broken** - Usually it's data or deployment

---

## 📚 Documentation Hierarchy

1. **THIS FILE** - Architecture overview (read first)
2. **docs/MARKET_INTELLIGENCE_GUIDE.md** - Detailed system guide
3. **walkthrough.md** - Project history and changes
4. **task.md** - Current task tracking

---

**Remember:** This system is PRODUCTION READY and WORKING. The best code is code that doesn't need to be written. Add features, don't break what works!
