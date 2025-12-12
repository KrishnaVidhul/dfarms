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

# Add to crontab if not exists
# Schedule: 0 */8 * * * (At minute 0 past every 8th hour)
CRON_JOB="0 */8 * * * /usr/bin/python3 $SCRIPT_PATH >> $LOG_FILE 2>&1"

(crontab -l 2>/dev/null; echo "$CRON_JOB") | sort -u | crontab -

echo "✅ Automation Installed!"
echo "   Schedule: Every 8 hours"
echo "   Script: $SCRIPT_PATH"
echo "   Log: $LOG_FILE"
echo "   Run 'crontab -l' to verify."
