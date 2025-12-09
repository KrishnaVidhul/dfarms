import os
from langchain_ollama import ChatOllama

api_base = os.environ.get("OPENAI_API_BASE", "http://host.docker.internal:11434")
# ChatOllama expects base url like http://host.docker.internal:11434 (no /v1)
ollama_base = api_base.replace("/v1", "")

print(f"Testing ChatOllama with base: {ollama_base}")

llm = ChatOllama(model="llama3:latest", base_url=ollama_base)
try:
    print(llm.invoke("Hello"))
    print("SUCCESS")
except Exception as e:
    print(f"FAILURE: {e}")
