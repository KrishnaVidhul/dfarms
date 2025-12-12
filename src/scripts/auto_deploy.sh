#!/bin/bash
# D-Farms Continuous Deployment Script
# Checks for updates on GitHub and applies them automatically.

LOG_FILE="/var/log/dfarms/deploy.log"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Ensure log directory exists
sudo mkdir -p /var/log/dfarms
sudo chown $(whoami) /var/log/dfarms

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

cd "$PROJECT_DIR" || exit 1

# Fetch latest changes
git fetch origin main >> "$LOG_FILE" 2>&1

# Check if local is behind origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    log "🚀 Update detected! Local: ${LOCAL:0:7} -> Remote: ${REMOTE:0:7}"
    
    # Pull changes
    log "Step 1: Pulling code..."
    git pull origin main >> "$LOG_FILE" 2>&1
    
    # Install dependencies
    log "Step 2: Updating dependencies..."
    if [ -f "src/agent_runtime/requirements.txt" ]; then
        pip install -r src/agent_runtime/requirements.txt >> "$LOG_FILE" 2>&1
    fi
    
    # Restart Services
    log "Step 3: Restarting services..."
    if sudo systemctl restart dfarms-agent; then
        log "✓ dfarms-agent restarted"
    else
        log "✗ Failed to restart dfarms-agent"
    fi
    
    if sudo systemctl restart dfarms-auto-dev; then
        log "✓ dfarms-auto-dev restarted"
    else
        log "✗ Failed to restart dfarms-auto-dev"
    fi
    
    log "✅ Deployment Complete."
else
    # No updates, silent exit (or verbose log if debugging)
    # log "No updates found."
    :
fi
