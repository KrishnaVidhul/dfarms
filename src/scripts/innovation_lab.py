
import os
import random
import sys
from langchain_community.tools import DuckDuckGoSearchRun

# Queries for Indian Agri-Tech context
QUERIES = [
    "top features Ninjacart mobile app 2024",
    "WayCool Foods tech stack features",
    "AgroStar android app features for farmers",
    "DeHaat app features for agriculture",
    "best ux for indian farmer apps",
    "whatsapp integration for mandi prices india",
    "automated quality grading pulses technology"
]

def search_for_ideas():
    print("[Innovation_Lab] Searching the web for cutting-edge Agri-Tech features...")
    search = DuckDuckGoSearchRun()
    
    query = random.choice(QUERIES)
    print(f"[Innovation_Lab] Selected Query: '{query}'")
    
    try:
        # 1. Execute Search
        results = search.run(query)
        # print(f"Raw Results: {results[:200]}...") # Debug
        
        # 2. Extract 'Idea' (Simple extraction logic or mocked intelligence if results are vague)
        # In a real LLM scenario, we'd feed 'results' to GPT-4 to ask "What feature is missing in D Farms?"
        # Here we will simulate the extraction of a structured idea based on the query theme.
        
        feature_idea = generate_mock_idea(query, results)
        
        # 3. Add to Backlog
        append_to_backlog(feature_idea)
        
    except Exception as e:
        print(f"[Innovation_Lab] Search failed: {e}")

def generate_mock_idea(query, results):
    """
    Simulates the cognitive step of extracting a feature from search results.
    """
    if "whatsapp" in query:
        return {
            "title": "WhatsApp Price Bot",
            "source": "AgTech Trends 2025",
            "idea": "Allow farmers to send 'Rate Tur Dal' on WhatsApp and get instant price response."
        }
    elif "grading" in query:
        return {
            "title": "AI Visual Grading v2",
            "source": "Computer Vision Research",
            "idea": "Enhance grading to detect 'Weevil Damage' specifically using localized contrast enhancement."
        }
    elif "Ninjacart" in query or "WayCool" in query:
        return {
            "title": "Reverse Auction Bidding",
            "source": "Competitor Analysis (Ninjacart)",
            "idea": "Allow suppliers to bid down prices for a buy order in real-time for 30 mins."
        }
    else:
        return {
            "title": "Voice-First Navigation",
            "source": "UX Trends India",
            "idea": "Add a microphone button to every screen. Farmers prefer speaking 'Add 100kg Chana' over typing."
        }

def append_to_backlog(feature):
    backlog_path = "src/design_backlog.md"
    
    # Check for duplicates
    if os.path.exists(backlog_path):
        with open(backlog_path, 'r') as f:
            content = f.read()
            if feature['title'] in content:
                print(f"[Innovation_Lab] Feature '{feature['title']}' already exists. Skipping.")
                return

    entry = f"""
## Feature: {feature['title']}
**Source:** {feature['source']}
**Idea:** {feature['idea']}
**Priority:** Medium
**Status:** PROPOSED

"""
    print(f"[Innovation_Lab] Discovered New Feature: {feature['title']}")
    
    with open(backlog_path, 'a') as f:
        f.write(entry)
    print("[Innovation_Lab] Added to Design Backlog.")

    # 4. Bridge to Autonomous Dev (DB Insert)
    try:
        import psycopg2
        DB_URL = os.environ.get("DATABASE_URL", "postgresql://dfarms_user:dfarms_pass@localhost:5432/dfarms_db")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Check if exists
        cur.execute("SELECT 1 FROM feature_roadmap WHERE feature_name = %s", (feature['title'],))
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO feature_roadmap (feature_name, source, status)
                VALUES (%s, %s, 'PLANNED')
            """, (feature['title'], feature['source']))
            conn.commit()
            print(f"[Innovation_Lab] Sync: Added '{feature['title']}' to Feature Roadmap DB.")
        else:
             print(f"[Innovation_Lab] Sync: '{feature['title']}' already in DB.")
        conn.close()
    except Exception as e:
        print(f"[Innovation_Lab] DB Sync Failed: {e}")

if __name__ == "__main__":
    search_for_ideas()
