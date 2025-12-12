
import os
import psycopg2
try:
    from crewai.tools import BaseTool
except ImportError:
    try:
        from crewai_tools import BaseTool
    except ImportError:
        from langchain.tools import BaseTool
from datetime import datetime, timedelta

class TotalCRMTool(BaseTool):
    name: str = "Manage CRM"
    description: str = "Manage Sales Leads. Actions: 'add_lead' (requires name), 'update_status' (lead_id, status), 'log_note' (lead_id, note), 'list_leads'. Input: action (str) and kwargs."

    def _run(self, action: str, **kwargs) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            if action == 'add_lead':
                name = kwargs.get('name')
                contact = kwargs.get('contact', '')
                if not name: return "Error: Name required."
                cur.execute("INSERT INTO crm_leads (name, contact_info) VALUES (%s, %s) RETURNING id", (name, contact))
                lead_id = cur.fetchone()[0]
                conn.commit()
                msg = f"Lead '{name}' added with ID: {lead_id}."

            elif action == 'update_status':
                lead_id = kwargs.get('lead_id')
                status = kwargs.get('status')
                if not lead_id or not status: return "Error: lead_id and status required."
                cur.execute("UPDATE crm_leads SET status = %s WHERE id = %s", (status, lead_id))
                conn.commit()
                msg = f"Lead ID {lead_id} status updated to '{status}'."
                if status == 'Closed-Won':
                    msg += " SUGGESTION: Generate Invoice now."

            elif action == 'log_note':
                lead_id = kwargs.get('lead_id')
                note = kwargs.get('note')
                cur.execute("UPDATE crm_leads SET notes = notes || '\n[' || NOW() || '] ' || %s WHERE id = %s", (note, lead_id))
                conn.commit()
                msg = f"Note logged for Lead ID {lead_id}."

            elif action == 'list_leads':
                cur.execute("SELECT id, name, status, last_contact_date FROM crm_leads ORDER BY last_contact_date DESC LIMIT 5")
                rows = cur.fetchall()
                msg = "Recent Leads:\n" + "\n".join([f"ID {r[0]}: {r[1]} ({r[2]})" for r in rows])

            else:
                msg = f"Unknown action: {action}"

            cur.close()
            conn.close()
            return msg

        except Exception as e:
            return f"CRM Error: {str(e)}"

class ComplianceCheckTool(BaseTool):
    name: str = "Check Compliance"
    description: str = "Checks for expiring regulatory licenses. Returns status report."

    def _run(self) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            # Update statuses first
            cur.execute("""
                UPDATE compliance_tracker 
                SET status = CASE 
                    WHEN expiry_date < CURRENT_DATE THEN 'Expired'
                    WHEN expiry_date < CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
                    ELSE 'Active'
                END
            """)
            conn.commit()
            
            # Fetch Report
            cur.execute("SELECT license_name, expiry_date, status FROM compliance_tracker ORDER BY expiry_date ASC")
            rows = cur.fetchall()
            
            report = "Compliance Status Report:\n"
            alert = False
            for r in rows:
                date_str = r[1].strftime('%Y-%m-%d')
                report += f"- {r[0]}: {r[2]} (Expires: {date_str})\n"
                if r[2] in ['Expired', 'Expiring Soon']:
                    alert = True
            
            cur.close()
            conn.close()
            
            if alert:
                return "WARNING: Compliance Issues Detected!\n" + report
            return "All Systems Green. No immediate compliance risks.\n" + report

        except Exception as e:
            return f"Compliance Check Error: {str(e)}"
