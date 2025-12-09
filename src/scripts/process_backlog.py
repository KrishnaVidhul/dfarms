
import json
import os

def process_backlog():
    backlog_path = os.path.join(os.path.dirname(__file__), '../backlog.json')
    
    if not os.path.exists(backlog_path):
        print("No backlog found.")
        return

    try:
        with open(backlog_path, 'r') as f:
            tickets = json.load(f)
            
        if not tickets:
            print("Backlog is empty.")
            return

        # Prioritize Tickets (High > Medium > Low)
        high_priority = [t for t in tickets if t['priority'] == 'High']
        target_ticket = high_priority[0] if high_priority else tickets[0]
        
        print(f"Top Priority Ticket: {target_ticket['id']}")
        print(f"Title: {target_ticket['title']}")
        print(f"Description: {target_ticket['description']}")
        
        # Generate Action Prompt for Super Agent (Developer Persona)
        prompt = f"""
        DEV ASSIGNMENT:
        Ticket: {target_ticket['id']}
        Goal: {target_ticket['title']}
        Context: {target_ticket['description']}
        
        Instructions:
        1. Analyze the codebase to find the source of this bug.
        2. Propose a fix or implement it if within capability.
        """
        
        print("\n--- Generated Prompt for Dev Agent ---")
        print(prompt)
        
        # In a real loop, we would IPC this to the Super Agent.
        # For this demo, we just verify the file generation works.
        
    except Exception as e:
        print(f"Error processing backlog: {e}")

if __name__ == "__main__":
    process_backlog()
