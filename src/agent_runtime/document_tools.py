import os
import psycopg2
from crewai.tools import BaseTool
import json

# Mocking embedding generation if langchain/openai not installed or configured
# In production this would use proper embeddings
def generate_mock_embedding(text):
    # Determine dimension based on what we set in DB (1536)
    # Return a dummy vector of 1536 floats
    import random
    # Seed for reproducibility in simulation
    random.seed(len(text)) 
    return [random.uniform(-1, 1) for _ in range(1536)]

class IngestDocumentTool(BaseTool):
    name: str = "Ingest Document"
    description: str = "Ingests a document (text/image/pdf) into corporate memory. Input: 'file_path|metadata_json'"

    def _run(self, tool_input: str) -> str:
        try:
            parts = tool_input.split('|', 1)
            file_path = parts[0].strip()
            metadata_str = parts[1].strip() if len(parts) > 1 else "{}"
            
            # Simulate OCR/Text Extraction
            # In real system: Use Unstructured or OCR
            extracted_text = f"Simulated content extracted from {os.path.basename(file_path)}"
            
            # Generate Embedding
            embedding = generate_mock_embedding(extracted_text)
            
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO corporate_memory (content_text, embedding, file_path, metadata)
                VALUES (%s, %s, %s, %s)
            """, (extracted_text, embedding, file_path, metadata_str))
            
            conn.commit()
            conn.close()
            
            return f"Successfully ingested {file_path}. Memory ID created."
            
        except Exception as e:
            return f"Ingest Error: {e}"

class SearchMemoryTool(BaseTool):
    name: str = "Search Memory"
    description: str = "Search corporate knowledge. Input: Query String (e.g., 'Driver Contract Suresh')"

    def _run(self, query: str) -> str:
        try:
            # Generate query embedding
            query_embedding = generate_mock_embedding(query)
            
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            # Vector Similarity Search (L2 Distance <->)
            # Using basic default, typically <=> for cosine similarity or <-> for L2
            # Casting array to vector
            query_vector_str = "[" + ",".join(map(str, query_embedding)) + "]"
            
            cur.execute("""
                SELECT content_text, file_path, metadata, 1 - (embedding <=> %s) AS similarity
                FROM corporate_memory
                ORDER BY similarity DESC
                LIMIT 3;
            """, (query_vector_str,))
            
            rows = cur.fetchall()
            conn.close()
            
            if not rows:
                return "No relevant documents found."
            
            results = "Found Documents:\n"
            for row in rows:
                results += f"- {row[1]} (Score: {row[3]:.2f}): {row[0]}\n"
                
            return results
        except Exception as e:
            return f"Search Error: {e}"
