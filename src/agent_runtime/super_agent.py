
# Minimal imports for startup
import os
import time
import sys

# Add path for relative imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


# Valid Shim
try:
    from crewai_tools import BaseTool
except ImportError:
    try:
        from langchain.tools import BaseTool
    except ImportError:
        # Fallback to heavy import only if necessary
        from crewai.tools import BaseTool

# --- LIGHTWEIGHT TOOL CLASSES ---
from langchain_community.tools import DuckDuckGoSearchRun # This might be heavy? Let's hide it if possible, but BaseTool needs it? 
# Actually BaseTool doesn't need DuckDuckGo. ScoutSearchTool needs it in _run.
# We can import DuckDuckGo inside _run.

class ScoutSearchTool(BaseTool):
    name: str = "Market Search"
    description: str = "Search the web for market prices."

    def _run(self, query: str) -> str:
        from langchain_community.tools import DuckDuckGoSearchRun
        search = DuckDuckGoSearchRun()
        return search.run(query)

class RecordPriceTool(BaseTool):
    name: str = "Record Market Price"
    description: str = "Useful to save found market prices."

    def _run(self, tool_input: str) -> str:
        import psycopg2
        try:
            parts = tool_input.split('|')
            if len(parts) != 4:
                return "Error: Input must be 'Pulse Type|Location|Price|Recommendation'"
            pulse, location, price, rec = [p.strip() for p in parts]
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("INSERT INTO market_prices (pulse_type, location, price, recommendation) VALUES (%s, %s, %s, %s)", (pulse, location, price, rec))
            conn.commit()
            conn.close()
            return "Successfully recorded price."
        except Exception as e:
            return f"Database Error: {e}"

# Global DB Connection (Lazy)
db_conn = None

def get_db_connection():
    global db_conn
    import psycopg2
    try:
        if db_conn is None or db_conn.closed != 0:
            db_conn = psycopg2.connect(os.environ["DATABASE_URL"])
            with db_conn.cursor() as cur:
                cur.execute("SELECT 1")
    except Exception as e:
        print(f"Reconnecting to DB failed: {e}")
        db_conn = None 
    return db_conn

def process_command(command_text, crew_agent, crew_class, task_class, process_class):
    print(f"COO Processing: {command_text}")
    
    # Fast-path for Health Checks
    if command_text == "PING_HEALTH_CHECK" or command_text.startswith("AUDIT_TEST_PING"):
        return f"PONG: {command_text} - Acknowledged."
    
    task = task_class(
        description=f"Analyze command: '{command_text}'. Use tools to execute.",
        expected_output="Action confirmation.",
        agent=crew_agent
    )
    
    crew = crew_class(
        agents=[crew_agent],
        tasks=[task],
        process=process_class.sequential,
        verbose=True
    )
    
    return crew.kickoff()

def main():
    print("D Farms SUPER AGENT (COO) Starting... (Lazy Loading)")
    
    # --- HEAVY IMPORTS HERE ---
    print("DEBUG: Importing dependencies...")
    import psycopg2
    import json
    
    from crewai import Agent, Task, Crew, Process
    # Check if ChatOpenAI needs robust import? usually langchain_openai is fine
    from langchain_openai import ChatOpenAI 

    # Import other tools
    from db_tools import AddStockTool, CheckStockTool, ProcessBatchTool
    from analytics_tools import PricePredictionTool
    from vision_tools import QualityGradingTool
    from finance_tools import InvoiceGeneratorTool
    from admin_tools import TotalCRMTool, ComplianceCheckTool
    from document_tools import IngestDocumentTool, SearchMemoryTool
    
    print("DEBUG: Imports Done. Configuring Agent...")

    # --- CONFIGURATION ---
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
    
    # LLM Init
    llm = ChatOpenAI(
        model="llama-3.3-70b-versatile",
        openai_api_key=GROQ_API_KEY,
        openai_api_base="https://api.groq.com/openai/v1",
        temperature=0.1
    )
    
    # Initialize Tools
    all_tools = [
        AddStockTool(), CheckStockTool(), ProcessBatchTool(), 
        ScoutSearchTool(), RecordPriceTool(),
        ProcessBatchTool(), PricePredictionTool(), QualityGradingTool(), InvoiceGeneratorTool(),
        TotalCRMTool(), ComplianceCheckTool(), IngestDocumentTool(), SearchMemoryTool()
    ]

    # Super Agent Init
    super_agent = Agent(
        role='Business Operations Director',
        goal='Manage operations.',
        backstory="Executive leader.",
        tools=all_tools,
        verbose=True,
        memory=False,
        max_iter=5, 
        llm=llm
    )
    
    print("DEBUG: Agent Ready. Entering Loop...")
    get_db_connection()
    
    while True:
        # ... Loop logic same as before ... 
        print(f"DEBUG: Start Loop {time.time()}")
        try:
             conn = get_db_connection()
             if conn:
                try:
                    cur = conn.cursor()
                    cur.execute("SELECT id, command FROM agent_jobs WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 1")
                    row = cur.fetchone()
                    
                    if row:
                        job_id, cmd = row
                        print(f"DB Command Received: {cmd} (ID: {job_id})")
                        cur.execute("UPDATE agent_jobs SET status = 'PROCESSING' WHERE id = %s", (job_id,))
                        conn.commit()
                        
                        try:
                            result = process_command(cmd, super_agent, Crew, Task, Process)
                            cur.execute("UPDATE agent_jobs SET status = 'COMPLETED', result = %s, updated_at = NOW() WHERE id = %s", (str(result), job_id))
                        except Exception as exec_err:
                            print(f"Command Execution Error: {exec_err}")
                            cur.execute("UPDATE agent_jobs SET status = 'FAILED', result = %s, updated_at = NOW() WHERE id = %s", (str(exec_err), job_id))
                        conn.commit()
                        print(f"Command {job_id} Finished.")
                    cur.close()
                except Exception as db_err:
                    print(f"DB Polling Error: {db_err}")
                    if conn.closed != 0: conn = None
             
             time.sleep(2)
        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()

# --- CONFIGURATION (GROQ SHIM) ---
# Fetch API Key from environment (set by systemd or user)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

if not GROQ_API_KEY:
    # Fallback or error - but for now just warn if missing
    print("WARNING: GROQ_API_KEY not found in environment.")


# Use ChatOpenAI to talk to Groq
llm = ChatOpenAI(
    model="llama-3.3-70b-versatile",
    openai_api_key=GROQ_API_KEY,  # Correct param for langchain-openai 0.1.x
    openai_api_base="https://api.groq.com/openai/v1", # Correct param for langchain-openai 0.1.x
    temperature=0.1
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
# llm_model = "ollama/llama3:latest"

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
    max_iter=5, # PREVENT INFINITE LOOPS
    llm=llm # Explicitly use the Gemini LLM
)

def process_command(command_text):
    print(f"COO Processing: {command_text}")
    
    # Fast-path for Health Checks
    if command_text == "PING_HEALTH_CHECK" or command_text.startswith("AUDIT_TEST_PING"):
        return f"PONG: {command_text} - Acknowledged."
    
    
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


# ... (Imports remain same)

# Global DB Connection
db_conn = None

def get_db_connection():
    global db_conn
    try:
        if db_conn is None or db_conn.closed != 0:
            db_conn = psycopg2.connect(os.environ["DATABASE_URL"])
            # Keep alive check
            with db_conn.cursor() as cur:
                cur.execute("SELECT 1")
    except Exception as e:
        print(f"Reconnecting to DB failed: {e}")
        db_conn = None # Retry next time
    return db_conn

def main():
    print("D Farms SUPER AGENT (COO) Started...")
    
    # Initial Connection
    get_db_connection()
    
    while True:
        print(f"DEBUG: Start Loop {time.time()}")
        try:
            # 1. Database Commands Loop (Polling)
            conn = get_db_connection()
            if conn:
                try:
                    cur = conn.cursor()
                    
                    # Poll for PENDING jobs
                    cur.execute("SELECT id, command FROM agent_jobs WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 1")
                    row = cur.fetchone()
                    
                    if row:
                        job_id, cmd = row
                        print(f"DB Command Received: {cmd} (ID: {job_id})")
                        
                        # Mark as PROCESSING
                        cur.execute("UPDATE agent_jobs SET status = 'PROCESSING' WHERE id = %s", (job_id,))
                        conn.commit()
                        
                        try:
                            result = process_command(cmd)
                            # Mark as COMPLETED
                            cur.execute("UPDATE agent_jobs SET status = 'COMPLETED', result = %s, updated_at = NOW() WHERE id = %s", (str(result), job_id))
                        except Exception as exec_err:
                            print(f"Command Execution Error: {exec_err}")
                            # Mark as FAILED
                            cur.execute("UPDATE agent_jobs SET status = 'FAILED', result = %s, updated_at = NOW() WHERE id = %s", (str(exec_err), job_id))
                        
                        conn.commit()
                        print(f"Command {job_id} Finished.")
                    
                    cur.close()
                    # Do NOT close conn here
                    
                except Exception as db_err:
                    print(f"DB Polling Error: {db_err}")
                    # If error is connection related, force reconnect next loop
                    if conn.closed != 0:
                         conn = None

            # 2. Sales Bridge Loop (Disk IO is cheap)
            sales_req_file = "/app/ipc/sales_query.json"
            sales_res_file = "/app/ipc/sales_response.json"
            
            if os.path.exists(sales_req_file):
                print("DEBUG: Found Sales Request")
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
                    if os.path.exists(sales_req_file):
                         os.remove(sales_req_file)

            print("DEBUG: Sleeping...")
            time.sleep(2) # Increased to 2s to reduce CPU load
        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
