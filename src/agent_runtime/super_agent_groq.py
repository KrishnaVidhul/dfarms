import os
import time
import sys
import psycopg2
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Modern Stack
from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from langchain_groq import ChatGroq
from langchain_community.tools import DuckDuckGoSearchRun

# Local Tools
from db_tools import AddStockTool, CheckStockTool, ProcessBatchTool

# --- CONFIGURATION (GROQ) ---
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
# Fallback if env var missing (debug)
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in environment.")

# Use Groq Integration
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY,
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

# Import other tools if available, else skip gracefully
try:
    from analytics_tools import PricePredictionTool
except ImportError:
    class PricePredictionTool(BaseTool):
        name: str = "Price Prediction"
        description: str = "Predict prices."
        def _run(self, i): return "Check market manually."

try:
    from vision_tools import QualityGradingTool
except ImportError:
    class QualityGradingTool(BaseTool):
        name: str = "Quality Grading"
        description: str = "Grade quality."
        def _run(self, i): return "Quality check unavailable."

try:
    from finance_tools import InvoiceGeneratorTool
except ImportError:
    class InvoiceGeneratorTool(BaseTool):
        name: str = "Invoice Gen"
        description: str = "Generate invoice."
        def _run(self, i): return "Invoice gen unavailable."

try:
    from admin_tools import TotalCRMTool, ComplianceCheckTool
except ImportError:
    class TotalCRMTool(BaseTool):
        name: str = "CRM"
        description: str = "CRM tool."
        def _run(self, i): return "CRM unavailable."
    class ComplianceCheckTool(BaseTool):
        name: str = "Compliance"
        description: str = "Check compliance."
        def _run(self, i): return "Compliance unavailable."

try:
    from document_tools import IngestDocumentTool, SearchMemoryTool
except ImportError:
    class IngestDocumentTool(BaseTool):
        name: str = "Ingest Doc"
        description: str = "Ingest document."
        def _run(self, i): return "Ingestion unavailable."
    class SearchMemoryTool(BaseTool):
        name: str = "Search Memory"
        description: str = "Search memory."
        def _run(self, i): return "Memory unavailable."


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
    print("D Farms SUPER AGENT (COO Groq) Started...")
    while True:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
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
