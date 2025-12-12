import os
import time
import sys
import psycopg2

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool, initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
import json
from langchain_community.tools import DuckDuckGoSearchRun
from crewai.tools import BaseTool
from db_tools import AddStockTool, CheckStockTool, ProcessBatchTool

# --- CONFIGURATION (GEMINI NATIVE) ---
# Using Jules API Key provided by user
JULES_API_KEY = "AQ.Ab8RN6KR6Cs3hxDDprMa0l4wfdfcr8PGJEvYVVuIMqc_wwvq9Q"
os.environ["GOOGLE_API_KEY"] = JULES_API_KEY

# Use the Native Google Integration
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", 
    google_api_key=JULES_API_KEY,
    temperature=0.1
)

# ---- Tools ----

class ScoutSearchTool(BaseTool):
    name: str = "Market Search"
    description: str = "Search the web for market prices."

    def _run(self, query: str) -> str:
        search = DuckDuckGoSearchRun()
        return search.run(query)

class RecordPriceTool(BaseTool):
    name: str = "Record Market Price"
    description: str = "Save market prices. Input: Pulse Type|Location|Price|Recommendation"

    def _run(self, tool_input: str) -> str:
        try:
            parts = tool_input.split("|")
            if len(parts) != 4:
                return "Error: Input format wrong."
            pulse, location, price, rec = [p.strip() for p in parts]
            
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("INSERT INTO market_prices (pulse_type, location, price, recommendation) VALUES (%s, %s, %s, %s)", (pulse, location, price, rec))
            conn.commit()
            cur.close()
            conn.close()
            return "Successfully recorded price."
        except Exception as e:
            return f"Database Error: {e}"

# ---- Agent ----

inventory_tools = [AddStockTool(), CheckStockTool(), ProcessBatchTool()]
market_tools = [ScoutSearchTool(), RecordPriceTool()]

from analytics_tools import PricePredictionTool
from vision_tools import QualityGradingTool
from finance_tools import InvoiceGeneratorTool
from admin_tools import TotalCRMTool, ComplianceCheckTool
from document_tools import IngestDocumentTool, SearchMemoryTool

super_agent = Agent(
    role="Business Operations Director",
    goal="Manage operations, finances, market, quality, compliance.",
    backstory="You are the executive leader of D Farms.",
    tools=inventory_tools + market_tools + [
        ProcessBatchTool(), PricePredictionTool(), QualityGradingTool(), InvoiceGeneratorTool(),
        TotalCRMTool(), ComplianceCheckTool(), IngestDocumentTool(), SearchMemoryTool()
    ],
    verbose=True,
    memory=False,
    allow_delegation=False,
    llm=llm
)

def process_command(command_text):
    print(f"COO Processing: {command_text}")
    
    if command_text == "PING_HEALTH_CHECK":
        return "PONG: COO Agent is Online."
    
    task = Task(
        description=f"You received a command: {command_text}. Execute it.",
        expected_output="Confirmation of action.",
        agent=super_agent
    )
    
    crew = Crew(
        agents=[super_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )
    
    return crew.kickoff()

def main():
    print("D Farms SUPER AGENT (COO) Started...")
    while True:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            # FIXED QUOTING HERE: 'PENDING'
            cur.execute("SELECT id, command FROM agent_jobs WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 1")
            row = cur.fetchone()
            
            if row:
                job_id, cmd = row
                print(f"DB Job: {cmd} ({job_id})")
                cur.execute("UPDATE agent_jobs SET status = 'PROCESSING' WHERE id = %s", (job_id,))
                conn.commit()
                
                try:
                    result = process_command(cmd)
                    cur.execute("UPDATE agent_jobs SET status = 'COMPLETED', result = %s, updated_at = NOW() WHERE id = %s", (str(result), job_id))
                except Exception as exec_err:
                    print(f"Error: {exec_err}")
                    cur.execute("UPDATE agent_jobs SET status = 'FAILED', result = %s, updated_at = NOW() WHERE id = %s", (str(exec_err), job_id))
                
                conn.commit()
            
            cur.close()
            conn.close()
            time.sleep(1)
        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
