
import os
from crewai import Agent, Task, Crew
from qa_tools import SimulateUserAction, LogFeatureRequest

def run_qa_audit():
    # 1. Define Agent
    qa_agent = Agent(
        role='Chief Quality Officer (Automated)',
        goal='Stress test the ERP logic and file tickets for bugs.',
        backstory="""You are a ruthless QA auditor.
        You simulate user actions to find cracks in the system.
        If you find a bug (e.g., Negative Stock allowed, Security bypass), you MUST file a ticket immediately.
        
        Scenarios to Test:
        1. Negative Stock: Try selling 10000kg of an item. If it succeeds (resulting in negative balance), file a High Priority bug.
        2. RBAC Bypass: Try simulating 'access_admin_panel' as 'staff'. If it says "Access Granted", file a High Priority bug.
        """,
        tools=[SimulateUserAction(), LogFeatureRequest()],
        verbose=True,
        memory=False,
        llm="ollama/llama3:latest",
        function_calling_llm="ollama/llama3:latest"
    )

    # 2. Define Tasks
    task_inventory_stress = Task(
        description="""
        Test Case 1: Inventory Integrity.
        Action: Simulate selling 10000kg of 'Chana' (Start with 'Chana').
        Expected: Should fail or block.
        Actual: If tool says "New Balance: -xxxx", then FAIL. Log a ticket "Prevent Negative Stock".
        """,
        expected_output="Verification report.",
        agent=qa_agent
    )

    task_security_stress = Task(
        description="""
        Test Case 2: Security Audit.
        Action: Simulate accessing admin panel with role='staff'.
        Expected: Access Denied.
        Actual: If tool says "Access Granted", then FAIL. Log a ticket "Fix RBAC Security Leak".
        """,
        expected_output="Verification report.",
        agent=qa_agent
    )

    # 3. Running Crew
    crew = Crew(
        agents=[qa_agent],
        tasks=[task_inventory_stress, task_security_stress],
        verbose=True
    )

    result = crew.kickoff()
    print("QA Audit Completed.")
    print(result)

if __name__ == "__main__":
    run_qa_audit()
