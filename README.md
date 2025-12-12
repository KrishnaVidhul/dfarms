# D-Farms ERP System

Agricultural ERP system with AI-powered market intelligence.

## 🚀 Quick Start

### For AI Agents / Developers

**READ THIS FIRST:** [ARCHITECTURE.md](./ARCHITECTURE.md)

This document contains:
- ⚠️ What NOT to touch (working production code)
- 🏗️ Complete system architecture
- 📁 File structure and what each file does
- 🔌 API endpoints and data flow
- 🛠️ Safe operations guide
- 🐛 Troubleshooting

### For Users

**Market Intelligence Dashboard:** https://dfarms-frontend-4220168064.us-central1.run.app/app/market

**Login:**
- Username: `admin`
- Password: `password`

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | **START HERE** - System overview for AI agents |
| [docs/MARKET_INTELLIGENCE_GUIDE.md](./docs/MARKET_INTELLIGENCE_GUIDE.md) | Detailed setup and deployment guide |
| [walkthrough.md](./.gemini/antigravity/brain/f8d18f64-b018-4279-aee1-92f4c364d25f/walkthrough.md) | Project history and changes |

## 🎯 Key Features

### Market Intelligence
- ✅ Real-time commodity price data (data.gov.in API)
- ✅ AI-powered buy/sell recommendations
- ✅ Multi-factor analysis (Technical 70% + News 30%)
- ✅ Interactive price charts and filters
- ✅ 24 commodities, 24 states, 240 markets

### Multi-Factor Analysis
- **Technical Analysis:** Moving averages, momentum, volatility, trend detection
- **News Sentiment:** Keyword-based analysis of recent agricultural news
- **Combined Scoring:** Weighted average for holistic recommendations

## 🛠️ Essential Commands

```bash
# Fetch latest market data
python3 src/scripts/fetch_production_data.py

# Generate AI insights
python3 src/agent_runtime/market_intel_agent.py

# Build frontend
cd src/web && npm run build

# Deploy to Cloud Run
cd src/web && gcloud run deploy dfarms-frontend --source . --region us-central1
```

## 🗄️ Database

**Provider:** Supabase (PostgreSQL)

**Tables:**
- `market_prices` - Real commodity price data (5,880 records)
- `market_insights` - AI-generated recommendations

## 🌐 Deployment

**Frontend:** Google Cloud Run  
**Database:** Supabase PostgreSQL  
**Backend (Agents):** Cloud VM (dfarms-erp-prod)

## 📊 System Status

| Component | Status | Last Updated |
|-----------|--------|--------------|
| Data Fetcher | ✅ Working | Dec 10, 2025 |
| AI Agent | ✅ Working | Dec 10, 2025 |
| Frontend | ✅ Deployed | Dec 10, 2025 |
| Multi-Factor Analysis | ✅ Active | Dec 10, 2025 |

## ⚠️ Important Notes

1. **DO NOT modify working files** - See ARCHITECTURE.md for details
2. **Use fetch_production_data.py** - Only production data fetcher
3. **Multi-factor analysis is STABLE** - Don't refactor
4. **Frontend is DEPLOYED** - Changes require rebuild

## 🔮 Roadmap

- [ ] Weather forecast integration (20% weight)
- [ ] Yield prediction (15% weight)
- [ ] Government policy tracking (10% weight)
- [ ] Historical accuracy tracking

## 📝 License

Proprietary - D-Farms

---

**For detailed architecture and safe development practices, see [ARCHITECTURE.md](./ARCHITECTURE.md)**
