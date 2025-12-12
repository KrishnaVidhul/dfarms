#!/bin/bash
# D-Farms ERP - Automated Data Update Script
# Runs every 6 hours to fetch market data and generate AI insights

# Set environment variables
export DATABASE_URL="postgresql://postgres.urqbpbbomdpejbxhlgqq:gd3yF6HR9cK6@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"
export DATA_GOV_API_KEY="579b464db66ec23bdd0000015e444b28a9e7454e7778a5be3c0ebac5"
export GROQ_API_KEY="${GROQ_API_KEY}"

# Project directory
PROJECT_DIR="/home/$(whoami)/d_farms_core"

# Log file
LOG_FILE="/var/log/dfarms_update.log"

# Timestamp
echo "========================================" >> "$LOG_FILE"
echo "D-Farms Update Started: $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

# Step 1: Fetch latest market data
echo "Fetching market data..." >> "$LOG_FILE"
python3 src/scripts/fetch_production_data.py >> "$LOG_FILE" 2>&1
FETCH_STATUS=$?

if [ $FETCH_STATUS -eq 0 ]; then
    echo "✅ Market data fetched successfully" >> "$LOG_FILE"
else
    echo "❌ Market data fetch failed with status $FETCH_STATUS" >> "$LOG_FILE"
fi

# Step 2: Generate AI insights
echo "Generating AI insights..." >> "$LOG_FILE"
python3 src/agent_runtime/market_intel_agent.py >> "$LOG_FILE" 2>&1
AI_STATUS=$?

if [ $AI_STATUS -eq 0 ]; then
    echo "✅ AI insights generated successfully" >> "$LOG_FILE"
else
    echo "❌ AI insights generation failed with status $AI_STATUS" >> "$LOG_FILE"
fi

# Summary
echo "========================================" >> "$LOG_FILE"
echo "D-Farms Update Completed: $(date)" >> "$LOG_FILE"
echo "Data Fetch: $([ $FETCH_STATUS -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')" >> "$LOG_FILE"
echo "AI Insights: $([ $AI_STATUS -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
