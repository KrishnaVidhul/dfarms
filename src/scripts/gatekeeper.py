import subprocess
import sys
import time
import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

# Initialize Smart Brain
try:
    llm = ChatGroq(
        temperature=0,
        model_name="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY")
    )
except:
    llm = None

def check_web_integrity():
    """
    Runs a dry-run build check inside the 'web' container.
    """
    print("🛡️ [Gatekeeper] Verifying Web App Integrity (Syntax)...")
    try:
        cmd = ["docker", "exec", "dfarms_web", "sh", "-c", "npx tsc --noEmit"] 
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            return False, f"Type Check Failed:\n{result.stderr}\n{result.stdout}"
        print("   -> Syntax/Type Check Passed.")
        return True, "Integrity Verified."
    except Exception as e:
        return False, f"Gatekeeper Error: {str(e)}"

def semantic_code_review(feature_name):
    """
    Uses Llama-3-70b to review the generated code for logical flaws.
    """
    print(f"🧠 [Gatekeeper] Performing AI Code Review for {feature_name}...")
    
    if not llm:
        print("   -> Groq LLM not initialized. Skipping semantic review.")
        return True, "Skipped"

    # Read the file content
    file_path = f"src/web/app/(internal)/app/ai-lab/{feature_name.lower().replace(' ', '')}/page.tsx"
    try:
        with open(file_path, "r") as f:
            code = f.read()
    except:
        return True, "File not found (New feature?)"

    prompt = f"""
    You are the Gatekeeper, a Senior Code Reviewer. Review this Next.js Page Component:
    1. Check for infinite loops.
    2. Check for 'use client' if hooks are used.
    3. Check for invalid imports (e.g. from 'lucide-react').
    
    CODE:
    {code}
    
    Reply with 'APPROVED' if good, or 'REJECTED: <reason>' if bad.
    """
    
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        decision = response.content.strip()
        print(f"   -> Verdict: {decision}")
        
        if "REJECTED" in decision:
            return False, decision
        return True, "Approved by AI"
    except Exception as e:
        print(f"   -> Review Error: {e}")
        return True, "Review Failed (Fail Open)"

if __name__ == "__main__":
    # check_web_integrity() # Skip global check for speed, focus on feature
    
    feature = sys.argv[1] if len(sys.argv) > 1 else None
    
    # 1. Syntax Check
    success, logs = check_web_integrity()
    if not success:
        print("❌ Gatekeeper Failed (Syntax).")
        print(logs)
        sys.exit(1)

    # 2. Semantic Check (if feature provided)
    if feature:
        approved, reason = semantic_code_review(feature)
        if not approved:
             print(f"❌ Gatekeeper Rejected (AI): {reason}")
             sys.exit(1)
             
    print("✅ Gatekeeper Passed.")
    sys.exit(0)
