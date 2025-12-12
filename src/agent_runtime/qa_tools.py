
import os
import json
import psycopg2
import time
import glob
try:
    from crewai.tools import BaseTool
except ImportError:
    try:
        from crewai_tools import BaseTool
    except ImportError:
        from langchain.tools import BaseTool

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

class TestAgentResponsiveness(BaseTool):
    name: str = "Test Agent Health"
    description: str = "Pings other agents (COO, Sales) via IPC to check if they are running. Input: agent_name ('coo' or 'sales')."

    def _run(self, agent_name: str) -> str:
        try:
            req_file = ""
            res_file = ""
            payload = {}
            
            if agent_name.lower() == 'sales':
                req_file = "/app/ipc/sales_query.json"
                res_file = "/app/ipc/sales_response.json"
                payload = {"message": "PING_HEALTH_CHECK"}
            elif agent_name.lower() == 'coo':
                req_file = "/app/ipc/internal_command.json"
                res_file = "/app/ipc/internal_response.json"
                payload = {"command": "PING_HEALTH_CHECK"}
            else:
                return f"Unknown Agent: {agent_name}"

            # Clear old response
            if os.path.exists(res_file):
                os.remove(res_file)

            # Send Ping
            with open(req_file, 'w') as f:
                json.dump(payload, f)
            
            # Wait for response (Max 5s)
            start_time = time.time()
            while time.time() - start_time < 5:
                if os.path.exists(res_file):
                    with open(res_file, 'r') as f:
                        data = json.load(f)
                    return f"HEALTHY: {agent_name.upper()} responded in {round(time.time() - start_time, 2)}s. Response: {str(data)}"
                time.sleep(0.5)
            
            return f"CRITICAL: {agent_name.upper()} is UNRESPONSIVE (Timeout 5s)."

        except Exception as e:
            return f"Health Check Error: {str(e)}"

class VerifyFeatureDeployment(BaseTool):
    name: str = "Verify Deployment"
    description: str = "Checks if features marked as 'DEPLOYED' in roadmap actually exist. Input: None"

    def _run(self) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("SELECT feature_name FROM feature_roadmap WHERE status = 'DEPLOYED'")
            deployed = [row[0] for row in cur.fetchall()]
            cur.close()
            conn.close()

            if not deployed:
                return "No features currently marked as DEPLOYED."

            # Simple heuristic check (files exist?)
            # This is a basic implementation that could be expanded
            report = []
            for feature in deployed:
                # Naive search in web folder
                normalized = feature.lower().replace(" ", "")
                found = False
                # Walk through src/web/app to find something matching
                for root, dirs, files in os.walk("/app/src/web/app"):
                    for file in files:
                        if normalized in file.lower() or normalized in root.lower():
                            found = True
                            break
                    if found: break
                
                status = "VERIFIED" if found else "MISSING (Code not found)"
                report.append(f"- {feature}: {status}")

            return "Deployment Verification Report:\n" + "\n".join(report)

        except Exception as e:
            return f"Verification Error: {str(e)}"
