#!/bin/bash
# D-Farms Automation Setup
# Installs cron job for 8-hour market data updates

# Ensure log directory exists
sudo mkdir -p /var/log/dfarms
sudo chown $(whoami) /var/log/dfarms

# Define the command
# Assuming repo is at ~/d_farms_core
SCRIPT_PATH="$(pwd)/src/scripts/fetch_production_data.py"
LOG_FILE="/var/log/dfarms/market_fetch.log"

CRON_JOB_FETCH="0 */8 * * * /usr/bin/python3 $SCRIPT_PATH >> $LOG_FILE 2>&1"

# Continuous Deployment Job (Every 5 minutes)
DEPLOY_SCRIPT="$(pwd)/src/scripts/auto_deploy.sh"
CRON_JOB_CD="*/5 * * * * /bin/bash $DEPLOY_SCRIPT >> /var/log/dfarms/deploy.log 2>&1"

# Install both jobs
(crontab -l 2>/dev/null | grep -v "fetch_production_data.py" | grep -v "auto_deploy.sh"; echo "$CRON_JOB_FETCH"; echo "$CRON_JOB_CD") | sort -u | crontab -

echo "✅ Automation Installed!"
echo "   - Market Data: Every 8 hours"
echo "   - Auto-Deploy: Every 5 minutes"
echo "   Script: $SCRIPT_PATH"
echo "   Log: $LOG_FILE"
echo "   Run 'crontab -l' to verify."
