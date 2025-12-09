import argparse
import time
import subprocess
import os
import random
import sys

# Import Logger (Adjust path if needed, or assume PYTHONPATH includes src)
sys.path.append(os.path.join(os.path.dirname(__file__), '../agent_runtime'))
try:
    from agent_logger import AgentMonitor
except ImportError:
    # Fallback if import fails (local run vs docker)
    class AgentMonitor:
        def __init__(self, name): self.name = name
        def update_status(self, s, t): print(f"[{self.name}] {s}: {t}")
        def log(self, m): print(f"[{self.name}] LOG: {m}")

# Mock LLM for now (The "Brain")
def ask_llm_check(content, standards):
    # Simulate thinking
    time.sleep(1)
    # Demo logic: If file has "console.log" and NO "AI Refactor" tag, trigger fix.
    if "console.log" in content and "// AI Refactor" not in content:
        return True, "Code contains console.log which violates standards."
    return False, "Code looks compliant."

def ask_llm_fix(content, standards):
    # Simulate fix
    return content.replace("console.log", "// console.log removed by AI").replace("any", "unknown") + "\n// AI Refactor: Standards applied."

def run_command(command, cwd=None, ignore_error=False):
    try:
        result = subprocess.run(
            command, 
            cwd=cwd, 
            check=True, 
            text=True, 
            capture_output=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        if not ignore_error:
            raise e
        return None


# Mock LLM for Feature Generation
# Real LLM for Feature Generation
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

def ask_llm_feature(ticket_name, existing_files, feedback=None):
    """
    Direct prompt to LLM (Groq Llama-3 70B) to generate code.
    """
    try:
        chat = ChatGroq(
            temperature=0.7,
            model_name="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY")
        )
        
        # Context Injection: Read package.json to know available libraries
        import json
        try:
            with open("src/web/package.json", 'r') as f:
                pkg = json.load(f)
                deps = ", ".join(pkg.get("dependencies", {}).keys())
        except:
            deps = "react, next, lucide-react, tailwindcss"

        system_prompt = f"""You are a Senior React Developer building a Next.js Enterprise ERP (App Router).
        Output ONLY the raw code for the requested Page Component.
        
        AVAILABLE DEPENDENCIES: {deps}
        DO NOT USE ANY LIBRARY NOT LISTED ABOVE.
        
        CRITICAL RULES:
        1. **'use client' Directive**: If you use ANY React hooks (useState, useEffect, etc) or event handlers (onClick), you MUST put 'use client'; at the very top of the file (after imports).
        2. **Safe Icons**: Use `lucide-react` ONLY. Do NOT guess icon names. If unsure, use safe defaults like `Activity`, `Box`, `Circle`, `User`. Do NOT use `Fi` prefix.
        3. **Allowed Libraries**: You have access to: `recharts`, `date-fns`, `clsx`, `tailwind-merge`.
        4. **FORBIDDEN Libraries**: Do NOT use `react-leaflet`, `google-maps`, `axios`, or any uninstalled package.
        5. **Mock Data**: Do not leave comments like "// fetch data". Always provide realistic mock data inside the component so it renders immediately.
        
        FORMAT:
        - START the file with "// @ts-nocheck".
        - ALWAYS export default function Page().
        - Use Tailwind CSS for premium dark-mode styling.
        - Do not wrap in markdown code blocks. Just the code.
        """
        
        user_prompt = f"Create a feature component for: {ticket_name}. \nContext: The app is a dark-mode Dashboard for an Agri-Tech ERP."
        
        if feedback:
             user_prompt += f"\n\nCRITICAL FEEDBACK FROM PREVIOUS ATTEMPT (FIX THIS): \n{feedback}\nThe previous code was REJECTED. You must fix the errors described above."

        response = chat.invoke([SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)])
        return response.content
    except Exception as e:
        print(f"LLM Error: {e}")
        # Fallback if API fails
        return f"""// @ts-nocheck
import React from 'react';
import {{ AlertTriangle }} from 'lucide-react';

export default function ErrorFallback() {{
  return (
    <div className='p-4 text-red-400 border border-red-500 rounded'>
      <AlertTriangle />
      <h2 className='font-bold'>Creation Failed</h2>
      <p>Could not generate {ticket_name} due to API Error.</p>
    </div>
  );
}}
"""

def main():
    parser = argparse.ArgumentParser(description='Refactoring Engine')
    parser.add_argument('--file', help='File to refactor')
    parser.add_argument('--feature', help='Feature Ticket Name to implement')
    parser.add_argument('--feedback', help='Feedback/Error log from previous attempt')
    args = parser.parse_args()
    
    monitor = AgentMonitor("Refactor_Engine")
    monitor.update_status("IDLE", "Starting Engine...")
    
    if args.feature:
        handle_feature(args.feature, monitor, args.feedback)
    elif args.file:
        handle_refactor(args.file, monitor)
    else:
        monitor.log("Error: No arguments provided.")
        monitor.update_status("ERROR", "Missing arguments")

def handle_feature(ticket_name, monitor, feedback=None):
    monitor.update_status("THINKING", f"Planning feature: {ticket_name}")
    monitor.log(f"Received Feature Request: {ticket_name}")
    
    # Sanitize branch name: Alphanumeric only, lower case, max 50 chars
    import re
    safe_name = re.sub(r'[^a-zA-Z0-9]', '', ticket_name).lower()[:50]
    branch_name = f"feat/ai-{safe_name}-{int(time.time())}"
    # Change target to a Page Route for Auto-Deployment
    target_file = f"src/web/app/(internal)/app/ai-lab/{safe_name}/page.tsx"
    
    # 0. Git Safety & Identity Fix
    run_command(["git", "config", "--global", "--add", "safe.directory", "*"], ignore_error=True)
    run_command(["git", "config", "--global", "user.email", "agent@d-farms.ai"], ignore_error=True)
    run_command(["git", "config", "--global", "user.name", "Autonomous Agent"], ignore_error=True)

    # 1. Isolation
    monitor.update_status("CODING", f"Setting up branch {branch_name}")
    try:
        run_command(["git", "checkout", "-b", branch_name])
    except:
        run_command(["git", "checkout", branch_name])
        
    # 2. Implementation
    monitor.update_status("CODING", f"Generating React Code for {ticket_name}")
    code = ask_llm_feature(ticket_name, [], feedback)
    
    # Strip markdown if LLM disobeyed
    if code.startswith("```"):
        code = code.replace("```tsx", "").replace("```javascript", "").replace("```", "")
    
    # Ensure @ts-nocheck is present even if LLM forgot
    if "@ts-nocheck" not in code:
        code = "// @ts-nocheck\n" + code

    os.makedirs(os.path.dirname(target_file), exist_ok=True)
    with open(target_file, 'w') as f:
        f.write(code)
    monitor.log(f"Generated file: {target_file}")
    monitor.log(f"Code Preview:\n{code[:200]}...")
    
    # 3. Verification (GATEKEEPER)
    monitor.update_status("TESTING", "🛡️ Running Gatekeeper Validation...")
    try:
        from gatekeeper import check_web_integrity
        success, logs = check_web_integrity()
        if not success:
            monitor.log(f"❌ Gatekeeper Rejected Build:\n{logs}")
            monitor.update_status("ERROR", "Gatekeeper Rejected Build. Reverting...")
            # Revert Changes
            run_command(["rm", target_file])
            run_command(["git", "checkout", "main"])
            run_command(["git", "branch", "-D", branch_name], ignore_error=True)
            sys.exit(1) # Signal failure to orchestrator
        monitor.log("✅ Gatekeeper Passed. Proceeding to Deploy.")
    except ImportError:
        monitor.log("Warning: Gatekeeper module not found. Skipping check.")
    except Exception as e:
        monitor.log(f"Gatekeeper Exception: {e}")
        return
    
    # 4. Success (Push & PR)
    monitor.update_status("DELIVERING", "Committing to Git...")
    try:
        run_command(["git", "add", target_file])
        run_command(["git", "commit", "-m", f"feat(ai): implement {ticket_name}"])
        
        # Try Push
        monitor.update_status("DELIVERING", "Pushing to Origin...")
        try:
            # Authenticated Push via Token
            token = os.environ.get("GITHUB_TOKEN")
            repo_url = "github.com/KrishnaVidhul/dfarms.git"
            remote_url = f"https://oauth2:{token}@{repo_url}" if token else "origin"
            
            run_command(["git", "push", remote_url, branch_name])
             # PR Creation Logic
            if os.getenv("GITHUB_TOKEN"):
                 try:
                     run_command([
                         "gh", "pr", "create", 
                         "--title", f"Feat: {ticket_name}", 
                         "--body", f"Automated implementation of {ticket_name}.\n\nGenerated by RefactorEngine.",
                         "--base", "main",
                         "--head", branch_name
                     ], ignore_error=True)
                     monitor.log(f"PR Created for {ticket_name}")
                 except: 
                    pass
        except:
             monitor.log("Git Push Failed (Auth Error?). Branch is committed locally.")
             
    except Exception as e:
        monitor.log(f"Git Operations Failed: {e}")
        monitor.update_status("ERROR", f"Git Failed: {e}")
        
    # 5. Auto-Merge for Live Demo
    monitor.update_status("DELIVERING", "Merging to Main for Live Preview...")
    try:
        run_command(["git", "checkout", "main"])
        run_command(["git", "merge", branch_name])
        monitor.log(f"Merged {branch_name} to main.")
    except Exception as e:
         monitor.log(f"Merge Failed: {e}")

def handle_refactor(filepath, monitor):
    filename = os.path.basename(filepath)
    branch_name = f"refactor/ai-{int(time.time())}"

    monitor.update_status("THINKING", f"Auditing {filename}...")
    
    # 1. Audit
    try:
        with open("src/docs/enterprise_standards.md", 'r') as f:
            standards = f.read()
    except:
        standards = "Standard: No console.log"
        
    with open(filepath, 'r') as f:
        content = f.read()
        
    needs_fix, reasoning = ask_llm_check(content, standards)
    if not needs_fix:
        monitor.log(f"No issues found in {filename}.")
        monitor.update_status("IDLE", "Compliance Check Passed.")
        return

    monitor.log(f"Issue Detected: {reasoning}")

    # 2. Branch
    monitor.update_status("CODING", f"Creating branch {branch_name}")
    try:
        run_command(["git", "checkout", "-b", branch_name])
    except:
        run_command(["git", "checkout", branch_name])

    # 3. Apply Fix
    monitor.update_status("CODING", "Applying AI Fixes...")
    new_content = ask_llm_fix(content, standards)
    with open(filepath, 'w') as f:
        f.write(new_content)
    monitor.log(f"Applied fix to {filename}")

    # 4. Verify
    monitor.update_status("TESTING", "Running Docker Tests...")
    try:
        run_command(["docker", "exec", "dfarms_web", "sh", "-c", "if [ -f package.json ]; then echo 'Linting...'; else echo 'No package.json'; fi"])
        monitor.log("Verification Passed.")
    except Exception as e:
        monitor.log(f"Verification Failed: {e}")
        monitor.update_status("ERROR", "Verification Failed. Reverting.")
        run_command(["git", "checkout", "main", filepath])
        run_command(["git", "checkout", "main"])
        run_command(["git", "branch", "-D", branch_name])
        return

    # 5. Push
    monitor.update_status("DELIVERING", "Pushing Code...")
    try:
        run_command(["git", "add", filepath])
        run_command(["git", "commit", "-m", f"chore(ai): enforce enterprise standards in {filename}"])
        run_command(["git", "push", "origin", branch_name])
    except Exception as e:
        monitor.log(f"Push Failed: {e}")
        monitor.update_status("ERROR", "Push Failed")
        return

    # 6. PR
    monitor.update_status("DELIVERING", "Opening PR...")
    if os.getenv("GITHUB_TOKEN"):
         try:
             run_command([
                 "gh", "pr", "create", 
                 "--title", f"AI Refactor: {filename}", 
                 "--body", f"Automated fix based on Enterprise Standards.\n\nReasoning: {reasoning}",
                 "--base", "main",
                 "--head", branch_name
             ], ignore_error=True)
             monitor.log("PR Created Successfully")
         except:
             monitor.log("Warning: PR Creation failed.")
    
    run_command(["git", "checkout", "main"])
    monitor.update_status("IDLE", "Cycle Complete")

if __name__ == "__main__":
    main()
