
import os
import time

def simulate_uat():
    print("--- STARTING UAT SESSION: D FARMS ERP v1.0 ---")
    print("Participants: Arjun (Agri-Logistics Expert), Sarah (QA Lead)\n")
    
    backlog_items = []
    
    # MODULE A: Procurement
    print("\n[MODULE A: PROCUREMENT FLOW]")
    print("Sarah: 'Okay Arjun, show me how you'd buy 500kg of Chana using the current system.'")
    time.sleep(1)
    print("Arjun: (Types slowly) 'Bought... 500kg... Chana...' Ugh, this is too slow!")
    print("Arjun: 'Listen, at the Mandi, it's loud, dusty, and I'm being pushed around. I can't type text messages.'")
    print("Arjun: 'I need a big button to Record Audio. Or let me scan the Vendor's QR code to auto-fill details. And where are the market rates? I need to know if I'm overpaying instantly.'")
    print("Sarah: 'Got it. Text-first interface is a bottleneck. We need Audio-first + Visual Context.'")
    print(">> TICKET LOGGED: Voice-to-Text Procurement & Rate Overlay")
    
    backlog_items.append({
        "feature": "Voice-to-Text Procurement Logging",
        "description": "Enable one-tap audio recording for transactions. Agent parses speech to text.",
        "module": "Procurement",
        "impact": "High (Critical for Mandi usage)",
        "effort": "High (Requires Whisper integration)",
        "priority": 1
    })
    backlog_items.append({
        "feature": "Real-time Rate Widget Overlay",
        "description": "Show live market price difference (e.g., '+5% vs Market') next to the price input.",
        "module": "Procurement",
        "impact": "Medium",
        "effort": "Medium",
        "priority": 2
    })

    # MODULE B: Inventory
    print("\n[MODULE B: INVENTORY DASHBOARD]")
    print("Sarah: 'Here is your stock view. You have 10 tons of grain.'")
    time.sleep(1)
    print("Arjun: 'Great, but which batch expires first? I can't see expiry dates here.'")
    print("Arjun: 'If I ship the fresh stock and leave the old stock, I lose money. I need FEFO (First-Expired-First-Out) logic highlighted in RED.'")
    print("Arjun: 'And where are my trucks? A list of text doesn't help. Give me a Map View so I can optimize routes.'")
    print("Sarah: 'Understood. Data visualization is poor. We need Risk Indicators and Geospatial view.'")
    print(">> TICKET LOGGED: FEFO Indicators & Logistics Map")

    backlog_items.append({
        "feature": "FEFO Visual Indicators",
        "description": "Highlight batches expiring < 30 days in Red. Auto-sort by expiry.",
        "module": "Inventory",
        "impact": "High (Reduces spoilage loss)",
        "effort": "Low (Frontend logic)",
        "priority": 1
    })
    backlog_items.append({
        "feature": "Live Logistics Map",
        "description": "Mapbox integration to show warehouse and truck locations.",
        "module": "Logistics",
        "impact": "Medium",
        "effort": "High",
        "priority": 3
    })

    # MODULE C: Public Website
    print("\n[MODULE C: PUBLIC WEBSITE]")
    print("Sarah: 'This is the landing page for farmers.'")
    time.sleep(1)
    print("Arjun: 'It's pretty, but useless for them. Farmers don't carry laptops.'")
    print("Arjun: 'They have cheap Android phones with spotty internet. We need a PWA (Progressive Web App) that works offline.'")
    print("Arjun: 'The only thing they care about is: Did D Farms pay me yet? We need a Farmer Portal login.'")
    print("Sarah: 'Noted. Desktop-first is a fail. Needs Mobile-first PWA + Payment Tracking.'")
    print(">> TICKET LOGGED: Farmer Payment Portal (PWA)")

    backlog_items.append({
        "feature": "Farmer Payment Portal (Mobile PWA)",
        "description": "Mobile-optimized login for farmers to view payment status and ledger.",
        "module": "Web/Mobile",
        "impact": "High (Vendor Trust)",
        "effort": "High",
        "priority": 1
    })

    # GENERATE MARKDOWN
    export_path = os.path.join(os.path.dirname(__file__), '../design_backlog.md')
    with open(export_path, 'w') as f:
        f.write("# D Farms Design Backlog: UX Modernization\n")
        f.write("Generated from UAT Session with Logistics Head (Arjun)\n\n")
        
        f.write("| Priority | Feature | Module | Impact | Effort | Description |\n")
        f.write("|---|---|---|---|---|---|\n")
        
        # Sort by Priority then Impact
        sorted_backlog = sorted(backlog_items, key=lambda x: x['priority'])
        
        for item in sorted_backlog:
            f.write(f"| {item['priority']} | **{item['feature']}** | {item['module']} | {item['impact']} | {item['effort']} | {item['description']} |\n")
            
    print(f"\nSimulation Complete. Backlog generated at: {export_path}")

if __name__ == "__main__":
    simulate_uat()
