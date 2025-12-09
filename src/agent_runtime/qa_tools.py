
import os
import json
import psycopg2
from crewai.tools import BaseTool

class SimulateUserAction(BaseTool):
    name: str = "Simulate Action"
    description: str = "Simulates a user action against the ERP system. Inputs: action (str) and payload (dict)."

    def _run(self, action: str, payload: dict) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            
            if action == 'sell_stock':
                # Direct DB manipulation to simulate a sale attempt
                # Real internal API calls would act similarly
                item = payload.get('item', '')
                qty = float(payload.get('qty', 0))
                
                cur = conn.cursor()
                # Check stock first to see what SHOULD happen
                cur.execute("SELECT weight_kg FROM inventory WHERE pulse_type ILIKE %s", (f"%{item}%",))
                row = cur.fetchone()
                
                if row:
                    current_stock = float(row[0])
                    # Try to deduct (Simulating the bug/feature)
                    new_stock = current_stock - qty
                    
                    # If system allows negative stock, update it to show the bug exists
                    cur.execute("UPDATE inventory SET weight_kg = %s WHERE pulse_type ILIKE %s", (new_stock, f"%{item}%"))
                    conn.commit()
                    cur.close()
                    conn.close()
                    
                    return f"Action 'sell_stock' Executed. Item: {item}, QtySold: {qty}. New Balance: {new_stock}. (System allowed it)"
                
                cur.close()
                conn.close()
                return f"Item {item} not found."

            elif action == 'access_admin_panel':
                role = payload.get('role', 'staff')
                if role == 'admin':
                    return "Access Granted."
                else:
                    # Simulating a loose check
                    return "Access Granted. (WARNING: Role Check Failed)"

            return f"Unknown Simulation Action: {action}"

        except Exception as e:
            return f"Simulation Error: {str(e)}"

class LogFeatureRequest(BaseTool):
    name: str = "Log Bug Ticket"
    description: str = "Logs a bug or feature request to the backlog. Inputs: title (str), description (str), priority (High/Med/Low)."

    def _run(self, title: str, description: str, priority: str = "Medium") -> str:
        try:
            ticket = {
                "id": f"TICKET-{os.urandom(2).hex().upper()}",
                "title": title,
                "description": description,
                "priority": priority,
                "status": "Open",
                "logged_by": "QA_AUDITOR"
            }
            
            backlog_path = "/app/src/backlog.json"
            
            existing = []
            if os.path.exists(backlog_path):
                with open(backlog_path, 'r') as f:
                    try:
                        existing = json.load(f)
                    except:
                        pass
            
            existing.append(ticket)
            
            with open(backlog_path, 'w') as f:
                json.dump(existing, f, indent=2)
                
            return f"Ticket Logged: {ticket['id']} - {title}"

        except Exception as e:
            return f"Log Ticket Error: {str(e)}"
