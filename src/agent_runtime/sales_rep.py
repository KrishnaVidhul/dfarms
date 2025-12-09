import os
import psycopg2
from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool

# CRITICAL Environment Overrides (Same as super_agent)
os.environ["OPENAI_API_KEY"] = "ollama"
os.environ["OPENAI_API_BASE"] = "http://host.docker.internal:11434/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama3:latest"

# ---- Tools ----

class CheckStockTool(BaseTool):
    name: str = "Check Stock"
    description: str = "Checks the available stock of a pulse. Output is Read-Only. Argument: pulse_type (str)."

    def _run(self, pulse_type: str) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("SELECT SUM(weight_kg) FROM inventory WHERE pulse_type ILIKE %s AND status IN ('Packaged', 'Raw')", (pulse_type,))
            result = cur.fetchone()[0]
            conn.close()
            total = result if result else 0
            if total == 0:
                return f"We currently have no stock of {pulse_type}."
            return f"We have {total}kg of {pulse_type} available."
        except Exception as e:
            return f"Error checking stock: {str(e)}"

class PublicQuoteTool(BaseTool):
    name: str = "Get Quote"
    description: str = "Gets the selling price for a pulse. Argument: pulse_type (str)."

    def _run(self, pulse_type: str) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            # Fetch the latest price
            cur.execute("SELECT price FROM market_prices WHERE pulse_type ILIKE %s ORDER BY fetched_at DESC LIMIT 1", (pulse_type,))
            result = cur.fetchone()
            conn.close()
            
            if not result:
                return f"We do not have a current quote for {pulse_type}. Please contact support."
            
            # Parse price string "₹9200 per quintal" -> 9200
            price_str = result[0]
            import re
            match = re.search(r'[\d.]+', price_str.replace(',', ''))
            if not match:
                return f"Error parsing price: {price_str}"
            
            base_price = float(match.group())
            selling_price = base_price * 1.20 # 20% Margin
            
            return f"Our rate for {pulse_type} is ₹{selling_price:.2f} per quintal (Inclusive of logistics)."
            
        except Exception as e:
            return f"Error calculating quote: {str(e)}"

# ---- Deterministic Logic (Bypassing Flaky LLM) ----

def handle_sales_query(query: str) -> str:
    """
    Parses the query and routes to the appropriate tool directly.
    """
    query_lower = query.lower()
    
    # 1. Identify Pulse (Map to exact DB names)
    pulse = None
    if "chana" in query_lower: pulse = "Chana"
    elif "tur" in query_lower or "toor" in query_lower or "tuar" in query_lower: pulse = "Tur Dal"
    elif "moong" in query_lower: pulse = "Moong Dal"
    elif "urad" in query_lower: pulse = "Urad Dal"
    
    # 2. Identify Intent
    wants_stock = "stock" in query_lower or "have" in query_lower or "available" in query_lower or "qty" in query_lower
    wants_price = "price" in query_lower or "rate" in query_lower or "quote" in query_lower or "cost" in query_lower
    
    # Default: If pulse mentioned but no specific intent, give BOTH.
    if pulse and not wants_stock and not wants_price:
        wants_stock = True
        wants_price = True

    # 3. Execute
    response_parts = []
    
    if not pulse:
        return "I can help with Chana, Tur Dal, Moong Dal, and Urad Dal. Please specify which product you need."
        
    if wants_stock:
        try:
            stock_msg = CheckStockTool()._run(pulse)
            # Cleanup technical output if needed
            response_parts.append(stock_msg)
        except Exception as e:
            response_parts.append(f"Could not check stock for {pulse}.")

    if wants_price:
        try:
            price_msg = PublicQuoteTool()._run(pulse)
            response_parts.append(price_msg)
        except Exception as e:
            response_parts.append(f"Could not check price for {pulse}.")
            
    if not response_parts:
        return "I'm not sure what you need. Ask about 'stock' or 'price'."
        
    return "Sales Rep: " + " ".join(response_parts)

