FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2 (if needed, though binary is used) and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    && type -p curl >/dev/null || (apt update && apt install curl -y) \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install gh docker.io -y \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "if [ -f main.py ]; then python main.py; else echo 'Waiting for Agent init...'; tail -f /dev/null; fi"]
