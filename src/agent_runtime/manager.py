
import time
import os
import time
import sys

# CRITICAL: Override env vars BEFORE importing CrewAI/LangChain
# This prevents them from capturing the real OpenAI key/base at import time
os.environ["OPENAI_API_KEY"] = "ollama"
os.environ["OPENAI_API_BASE"] = "http://host.docker.internal:11434/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama3:latest"

# Append the directory containing db_tools.py to sys.path
# Since we are running from root with 'python src/agent_runtime/manager.py', 
# and db_tools is in src/agent_runtime, we need to make sure we can import it.
# We will use relative import or path modification.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from crewai import Agent, Task, Crew, Process
# from langchain_community.chat_models import ChatOllama # Deprecated/Unstable
from db_tools import AddStockTool, CheckStockTool

import requests

print("--- DEBUG INFO ---")
api_base = os.environ.get("OPENAI_API_BASE", "http://host.docker.internal:11434")
print(f"OLLAMA_BASE: {api_base}")

try:
    print("Testing connection to Ollama...")
    # ChatOllama standard API base is without /v1 usually, but let's check root
    resp = requests.get(api_base.replace("/v1", ""))
    print(f"Ollama Status: {resp.status_code}")
except Exception as e:
    print(f"Ollama Connection Failed: {e}")

try:
    print("Checking available models...")
    resp = requests.get(api_base.replace("/v1", "") + "/api/tags")
    print(f"Models: {resp.text}")
except Exception as e:
    print(f"Model Check Failed: {e}")

# Define the Model
# Using string configuration to leverage CrewAI's LiteLLM integration for Ollama
# Ensure OLLAMA_API_BASE is set in environment
# Define the Agent
inventory_manager = Agent(
    role='Inventory Manager',
    goal='Manage the inventory database based on natural language commands',
    verbose=True,
    memory=False,
    backstory='You are the responsible manager for the warehouse. You receive orders and update the database immediately.',
    tools=[AddStockTool(), CheckStockTool()],
    llm="ollama/llama3:latest",
    function_calling_llm="ollama/llama3:latest",
    allow_delegation=False
)

def process_command(command_text):
    print(f"Processing command: {command_text}")
    
    # Define Task
    task = Task(
        description=f"Execute this inventory command: '{command_text}'. Use the available tools to update or check the database.",
        expected_output="A confirmation message summarising what action was taken.",
        agent=inventory_manager
    )
    
    # Define Crew
    crew = Crew(
        agents=[inventory_manager],
        tasks=[task],
        process=Process.sequential,
        memory=False,
        verbose=True
    )
    
    # Execute
    result = crew.kickoff()
    return result

def main():
    print("D Farms Inventory Agent Started...")
    
    # Paths are relative to WORKDIR /app
    # command: python src/agent_runtime/manager.py
    # So ROOT is /app.
    # We expect src/commands.txt at /app/src/commands.txt
    commands_file = "src/commands.txt"
    logs_file = "src/logs.txt"
    
    print(f"Watching {commands_file}...")

    while True:
        try:
            if os.path.exists(commands_file):
                with open(commands_file, 'r') as f:
                    content = f.read().strip()
                
                if content:
                    print(f"Found command: {content}")
                    try:
                        result = process_command(content)
                        log_msg = f"CMD: {content}\nRES: {result}\n---\n"
                    except Exception as e:
                        print(f"Agent Error: {e}")
                        log_msg = f"CMD: {content}\nERR: {e}\n---\n"
                    
                    # Log result
                    with open(logs_file, 'a') as log:
                        log.write(log_msg)
                    
                    # Clear command file
                    open(commands_file, 'w').close()
                    print("Command processed and cleared.")
                    
            time.sleep(2)
        except Exception as e:
            print(f"Error in loop: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
