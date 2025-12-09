import os
import time
import sys
import psycopg2

# CRITICAL Environment Overrides for Local Ollama
os.environ["OPENAI_API_KEY"] = "ollama"
os.environ["OPENAI_API_BASE"] = "http://host.docker.internal:11434/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama3:latest"

# Add path for relative imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
from langchain.agents import Tool, initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
import os
import json
from langchain_community.tools import DuckDuckGoSearchRun
from crewai.tools import BaseTool
from db_tools import AddStockTool, CheckStockTool, ProcessBatchTool

# --- CONFIGURATION (GROQ CLOUD) ---
# We are now running on the cloud with Llama 3 70B (Senior Developer Level)
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# ---- Tools ----

# Search Wrapper
class ScoutSearchTool(BaseTool):
    name: str = "Market Search"
    description: str = "Search the web for market prices. Input should be a search query string e.g. 'Tur Dal Price Akola'."

    def _run(self, query: str) -> str:
        search = DuckDuckGoSearchRun()
        return search.run(query)

# Database Storage for Prices
class RecordPriceTool(BaseTool):
    name: str = "Record Market Price"
    description: str = "Useful to save found market prices. Input: 'Pulse Type|Location|Price|Recommendation'"

    def _run(self, tool_input: str) -> str:
        try:
            parts = tool_input.split('|')
            if len(parts) != 4:
                return "Error: Input must be 'Pulse Type|Location|Price|Recommendation'"
            pulse, location, price, rec = [p.strip() for p in parts]
            
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO market_prices (pulse_type, location, price, recommendation)
                VALUES (%s, %s, %s, %s)
            """, (pulse, location, price, rec))
            conn.commit()
            cur.close()
            conn.close()
            return "Successfully recorded price."
        except Exception as e:
            return f"Database Error: {e}"

# ---- Agent ----

# Define LLM for agents
llm_model = "ollama/llama3:latest"

# Initialize Tools
inventory_tools = [AddStockTool(), CheckStockTool(), ProcessBatchTool()]
market_tools = [ScoutSearchTool(), RecordPriceTool()]

from analytics_tools import PricePredictionTool
from vision_tools import QualityGradingTool
from finance_tools import InvoiceGeneratorTool
from admin_tools import TotalCRMTool, ComplianceCheckTool
from document_tools import IngestDocumentTool, SearchMemoryTool

# Super Agent (COO + QA + CFO + Ops Director)
super_agent = Agent(
    role='Business Operations Director',
    goal='Manage operations, finances, market strategy, quality, compliance, and corporate knowledge.',
    backstory="""You are the executive leader of D Farms.
    - If user wants to add/check stock, use Inventory Tools.
    - If user wants to check market trends or predict prices, use 'Predict Price Trend'.
    - If user wants to PROCESS stock, use the Process Batch Tool.
    - If user sends an IMAGE for quality check, use 'Grade Quality'.
    - If user asks to BILL, INVOICE, or SELL to a client, use 'Generate Invoice'.
    - If user asks about SALES, LEADS, or CUSTOMERS, use 'Manage CRM'.
    - If user asks about LICENSES, PERMITS, or COMPLIANCE, use 'Check Compliance'.
    - If user wants to SEARCH DOCUMENTS or contracts, use 'Search Memory'.
    - If user wants to STORE/UPLOAD a file, use 'Ingest Document'.
    
    Finance Rules:
    - Input for Invoice is JSON: {"customer_name": "...", "items": [{"item": "...", "weight_kg": 10, "price_per_kg": 90}]}
    - Start by getting the item details and price.
    
    Admin Rules:
    - Monitor compliance closely. Warn user immediately if any license is expiring.
    """,
    tools=inventory_tools + market_tools + [
        ProcessBatchTool(), PricePredictionTool(), QualityGradingTool(), InvoiceGeneratorTool(),
        TotalCRMTool(), ComplianceCheckTool(), IngestDocumentTool(), SearchMemoryTool()
    ],
    verbose=True,
    memory=False,
    allow_delegation=False,
    function_calling_llm="ollama/llama3:latest"
)

def process_command(command_text):
    print(f"COO Processing: {command_text}")
    
    # Fast-path for Health Checks
    if command_text == "PING_HEALTH_CHECK":
        return "PONG: COO Agent is Online."
    
    
    # We define a flexible task that allows the agent to pick the right tool
    task = Task(
        description=f"""
        You received a command: '{command_text}'.
        
        Analyze the command:
        1. If it involves ADDING stock (e.g., 'Add 100kg'), use 'Add Stock'.
        2. If it involves CHECKING stock (e.g., 'Do we have enough...'), use 'Check Stock'.
        3. If it is about MARKET PRICES (e.g., 'Find price of...', 'Should I buy...'), follow Market workflow.
        4. If it mentions "IMAGE", "QUALITY", or "ANALYZE" with a file path, use 'Grade Quality'.
        5. If it involves BILLING/INVOICING, use 'Generate Invoice'.
        6. If it involves LEADS or COMPLIANCE, use Admin Tools.
        7. If it involves DOCUMENTS, CONTRACTS, or SEARCHING FILES, use Document Tools.
        
        Execute the necessary actions and provide a summary.
        """,
        expected_output="A confirmation of the action taken (e.g., 'Stock added', 'Grade: A', 'Invoice Generated', 'Lead Added').",
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

    # 0. Initialize Database if needed
    try:
        import db_initializer
        db_initializer.init_db()
    except Exception as e:
        print(f"Startup DB Init Failed: {e}")

    commands_file = "src/commands.txt"
    logs_file = "src/logs.txt"
    while True:
        try:
            # 1. Internal Commands Loop (IPC)
            internal_cmd_file = "/app/ipc/internal_command.json"
            internal_res_file = "/app/ipc/internal_response.json"
            
            if os.path.exists(internal_cmd_file):
                import json
                try:
                    with open(internal_cmd_file, 'r') as f:
                        data = json.load(f)
                    
                    cmd = data.get("command", "")
                    if cmd:
                        print(f"Internal Command Received: {cmd}")
                        result = process_command(cmd)
                        
                        # Write Response
                        with open(internal_res_file, 'w') as f:
                            json.dump({"response": str(result)}, f)
                        
                        print("Internal Response Sent.")
                except Exception as e:
                    print(f"Internal Loop Error: {e}")
                    # Write Error Response
                    with open(internal_res_file, 'w') as f:
                         json.dump({"error": str(e)}, f)

                # Cleanup Request
                try:
                    os.remove(internal_cmd_file)
                except:
                    pass

            # 2. Sales Bridge Loop
            sales_req_file = "/app/ipc/sales_query.json"
            sales_res_file = "/app/ipc/sales_response.json"
            
            if os.path.exists(sales_req_file):
                try:
                    import json
                    # Read Request
                    with open(sales_req_file, 'r') as f:
                        data = json.load(f)
                    
                    query = data.get("message", "")
                    print(f"Sales Query Received: {query}")
                    
                    # Process with Sales Sub-Agent
                    from sales_rep import handle_sales_query
                    response_text = str(handle_sales_query(query))
                    
                    # Write Response
                    with open(sales_res_file, 'w') as f:
                        json.dump({"response": response_text}, f)
                    
                    # Cleanup Request
                    os.remove(sales_req_file)
                    print("Sales Response Sent.")
                    
                except Exception as e:
                    print(f"Sales Loop Error: {e}")
                    # Ensure we don't get stuck in a loop if file is bad
                    if os.path.exists(sales_req_file):
                         os.remove(sales_req_file)

            time.sleep(1)
        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
