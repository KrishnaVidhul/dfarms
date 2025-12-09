
import os
import io
import base64
import json
import psycopg2
from crewai.tools import BaseTool
from PIL import Image
import requests

class QualityGradingTool(BaseTool):
    name: str = "Grade Quality"
    description: str = "Analyzes an image of pulses to determine quality grade. Input: 'absolute_path_to_image'"

    def _run(self, image_path: str) -> str:
        try:
            print(f"DEBUG: Received image_path raw: '{image_path}'")
            # 1. Validate File
            image_path = image_path.strip().strip("'").strip('"') # Remove quotes if agent added them
            print(f"DEBUG: Cleaned image_path: '{image_path}'")
            
            if not os.path.exists(image_path):
                print(f"DEBUG: File not found at '{image_path}'")
                return f"Error: Image does not exist at {image_path}"

            # 2. Encode Image
            with open(image_path, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')

            # 3. Call LLaVA (Ollama)
            ollama_url = os.environ.get("OLLAMA_HOST", "http://host.docker.internal:11434")
            if not ollama_url.endswith("/api/generate"):
                ollama_url = f"{ollama_url}/api/generate"

            prompt = """
            Analyze this image of pulses (dal/grains).
            1. Estimate percentage of broken/split grains.
            2. Look for discoloration or foreign particles.
            3. Assign a Grade: A (Excellent), B (Good), or C (Poor).
            
            Return ONLY a JSON object:
            {
                "grade": "A/B/C",
                "broken_percent": 5,
                "discoloration": "None/Low/High",
                "summary": "Brief explanation"
            }
            """

            payload = {
                "model": "llava",
                "prompt": prompt,
                "stream": False,
                "images": [base64_image],
                "format": "json"
            }
            
            print(f"Sending to Vision Model: {ollama_url}...")
            response = requests.post(ollama_url, json=payload, timeout=60)
            
            if response.status_code != 200:
                return f"Vision Model Failed: {response.text}"

            result_json = response.json()
            analysis_text = result_json.get("response", "{}")
            
            # 4. Parse JSON
            try:
                analysis = json.loads(analysis_text)
            except:
                # Fallback if model chats instead of JSON
                return f"Model Analysis (Non-JSON): {analysis_text}"

            grade = analysis.get("grade", "B")
            defects = {
                "broken": analysis.get("broken_percent", 0),
                "discoloration": analysis.get("discoloration", "Unknown"),
                "summary": analysis.get("summary", "")
            }

            # 5. Save to DB
            batch_id = f"BATCH-{os.urandom(2).hex().upper()}" # Mock batch ID
            
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO quality_checks (batch_id, image_url, grade, defects_detected)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (batch_id, image_path, grade, json.dumps(defects)))
            
            check_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()

            return f"Quality Analysis Complete (ID: {check_id}):\nGrade: {grade}\nDefects: {defects}\nImage: {image_path}"

        except Exception as e:
            return f"Vision Logic Error: {str(e)}"
