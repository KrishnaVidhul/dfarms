import requests
import json
import os

api_base = os.environ.get("OPENAI_API_BASE", "http://host.docker.internal:11434")
ollama_base = api_base.replace("/v1", "")

print(f"Probing {ollama_base}...")

try:
    print("1. Checking Tags:")
    resp = requests.get(f"{ollama_base}/api/tags")
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Tags check failed: {e}")

try:
    print("\n2. Generating with llama3:latest:")
    resp = requests.post(f"{ollama_base}/api/generate", json={"model": "llama3:latest", "prompt": "hi", "stream": False})
    print(f"Status: {resp.status_code}")
    # Print start of body to avoid flooding
    print(f"Body: {resp.text[:200]}...")
except Exception as e:
    print(f"Gen llama3:latest failed: {e}")

try:
    print("\n3. Generating with llama3:")
    resp = requests.post(f"{ollama_base}/api/generate", json={"model": "llama3", "prompt": "hi", "stream": False})
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text[:200]}...")
except Exception as e:
    print(f"Gen llama3 failed: {e}")

try:
    print("\n4. Chatting with llama3:latest (api/chat):")
    resp = requests.post(f"{ollama_base}/api/chat", json={
        "model": "llama3:latest",
        "messages": [{"role": "user", "content": "hi"}],
        "stream": False
    })
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text[:200]}...")
except Exception as e:
    print(f"Chat llama3:latest failed: {e}")
