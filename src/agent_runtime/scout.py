import os
import psycopg2
from crewai import Agent, Task, Crew, Process
from langchain_community.tools import DuckDuckGoSearchRun
from crewai.tools import BaseTool
from pydantic import Field

# CRITICAL Environment Overrides for Local Ollama
os.environ["OPENAI_API_KEY"] = "ollama"
os.environ["OPENAI_API_BASE"] = "http://host.docker.internal:11434/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama3:latest"

# Tool 1: Search Wrapper
class ScoutSearchTool(BaseTool):
    name: str = "Market Search"
    description: str = "Search the web for market prices. Input should be a search query string."

    def _run(self, query: str) -> str:
        search = DuckDuckGoSearchRun()
        return search.run(query)

search_tool = ScoutSearchTool()

# Tool 2: Database Storage (Updated)
class RecordPriceTool(BaseTool):
    name: str = "Record Market Price"
    description: str = "Useful to save the found market price and recommendation to the database. Input should be a pipe-separated string: 'Pulse Type|Location|Price|Recommendation'"

    def _run(self, tool_input: str) -> str:
        try:
            # Parse input
            parts = tool_input.split('|')
            if len(parts) != 4:
                return "Error: Input must be 'Pulse Type|Location|Price|Recommendation'"
            
            pulse, location, price, rec = [p.strip() for p in parts]
            
            # Connect to DB
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            # Updated Insert for new schema
            cur.execute("""
                INSERT INTO market_prices (pulse_type, location, price, recommendation)
                VALUES (%s, %s, %s, %s)
            """, (pulse, location, price, rec))
            
            conn.commit()
            cur.close()
            conn.close()
            return "Successfully recorded price in database."
        except Exception as e:
            return f"Database Error: {e}"

# Agent
scout = Agent(
    role='Agri-Market Scout',
    goal="Find today's wholesale prices for Tur Dal in Akola, Maharashtra.",
    backstory='You are a sharp market scout who checks daily APMC rates in Maharashtra to help global buyers make decisions.',
    verbose=True,
    memory=False,
    allow_delegation=False,
    tools=[search_tool, RecordPriceTool()],
    llm="ollama/llama3:latest",
    function_calling_llm="ollama/llama3:latest"
)

# Task
price_hunt = Task(
    description="""
    1. Search for 'Akola Mandi Tur Dal Price Today'.
    2. Extract the price (e.g., '8500 INR/Q').
    3. Analyze: If price is below 9000 numerical value, recommendation is 'Buy'. Else 'Wait'.
    4. Use the 'Record Market Price' tool to save this data. Format: 'Tur Dal|Akola Mandi|{price_text}|{recommendation}'.
    """,
    expected_output="Confirmation that the price was recorded in the database.",
    agent=scout
)

# Crew
crew = Crew(
    agents=[scout],
    tasks=[price_hunt],
    verbose=True,
    process=Process.sequential
)

if __name__ == "__main__":
    print("Market Scout Starting...")
    result = crew.kickoff()
    print("######################")
    print(result)
