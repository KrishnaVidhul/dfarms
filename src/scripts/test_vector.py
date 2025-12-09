from agent_runtime.document_tools import IngestDocumentTool, SearchMemoryTool
import os

print("--- TESTING DOCUMENT TOOLS ---")
ingest = IngestDocumentTool()
search = SearchMemoryTool()

# 1. Ingest
res_ingest = ingest._run('contract_v1.pdf|{"type": "contract", "author": "Legal"}')
print(f"[Test] Ingest Result: {res_ingest}")

# 2. Search
res_search = search._run("contract legal")
print(f"[Test] Search Result: {res_search}")

if "contract_v1.pdf" in res_search:
    print("✅ Integration Test Passed: Vector Search works!")
else:
    print("❌ Integration Test Failed: Document not found.")
