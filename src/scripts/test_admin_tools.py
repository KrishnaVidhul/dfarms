
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from agent_runtime.admin_tools import ComplianceCheckTool, TotalCRMTool

def test_admin_tools():
    print("--- Testing Compliance Check Tool ---")
    compliance_tool = ComplianceCheckTool()
    result = compliance_tool._run()
    print("Compliance Check Result:")
    print(result)
    
    if "WARNING" in result and "FSSAI" in result:
        print("PASS: Compliance Tool correctly detected expiring license.")
    else:
        print("FAIL: Compliance Tool did not report expected warning.")

    print("\n--- Testing CRM Tool (List) ---")
    crm_tool = TotalCRMTool()
    result = crm_tool._run(action='list_leads')
    print("CRM List Result:")
    print(result)

    if "Big Basket" in result:
        print("PASS: CRM Tool listed seeded lead.")
    else:
        print("FAIL: CRM Tool did not list seeded lead.")

if __name__ == "__main__":
    test_admin_tools()
