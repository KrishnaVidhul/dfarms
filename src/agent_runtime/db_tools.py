import os
import secrets
import psycopg2
try:
    from crewai.tools import BaseTool
except ImportError:
    try:
        from crewai_tools import BaseTool
    except ImportError:
        from langchain.tools import BaseTool

class AddStockTool(BaseTool):
    name: str = "Add Stock"
    description: str = "Adds new stock to the inventory. Arguments: pulse_type (str), weight_kg (float), grade (str)."
    
    def _run(self, pulse_type: str, weight_kg: float, grade: str) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            batch_id = f"BATCH-AUTO-{secrets.token_hex(4).upper()}"
            status = "Raw"
            cur.execute("""
                INSERT INTO inventory (batch_id, pulse_type, grade, weight_kg, status)
                VALUES (%s, %s, %s, %s, %s)
            """, (batch_id, pulse_type, grade, weight_kg, status))
            conn.commit()
            cur.close()
            conn.close()
            return f"Successfully added {weight_kg}kg of {grade} {pulse_type} with Batch ID {batch_id}."
        except Exception as e:
            return f"Error adding stock: {str(e)}"

class CheckStockTool(BaseTool):
    name: str = "Check Stock"
    description: str = "Checks the total weight of a specific pulse type in inventory. Arguments: pulse_type (str)."

    def _run(self, pulse_type: str) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute("SELECT SUM(weight_kg) FROM inventory WHERE pulse_type ILIKE %s", (pulse_type,))
            result = cur.fetchone()[0]
            conn.close()
            total = result if result else 0
            return f"Total stock for {pulse_type}: {total}kg."
        except Exception as e:
            return f"Error checking stock: {str(e)}"

class ProcessBatchTool(BaseTool):
    name: str = "Process Batch"
    description: str = "Processes raw inventory into packaged goods. Arguments: batch_id (str), input_weight (float), target_type (str)."

    def _run(self, batch_id: str, input_weight: float, target_type: str) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()

            # 1. Verify Input Batch
            cur.execute("SELECT weight_kg, pulse_type, grade FROM inventory WHERE batch_id = %s AND status = 'Raw'", (batch_id,))
            result = cur.fetchone()
            
            if not result:
                conn.close()
                return f"Error: Batch {batch_id} not found or not in 'Raw' status."
            
            current_weight, input_pulse, grade = result
            
            if current_weight < input_weight:
                conn.close()
                return f"Error: Insufficient weight in batch {batch_id}. Available: {current_weight}kg."

            # 2. Calculate Yield
            yield_percent = 0.85
            output_weight = input_weight * yield_percent
            waste_weight = input_weight * (1 - yield_percent)
            
            # 3. Transaction
            try:
                # Deduct from Input
                cur.execute("UPDATE inventory SET weight_kg = weight_kg - %s WHERE batch_id = %s", (input_weight, batch_id))
                
                # Create Output Batch
                new_batch_id = f"BATCH-PROC-{secrets.token_hex(4).upper()}"
                cur.execute("""
                    INSERT INTO inventory (batch_id, pulse_type, grade, weight_kg, status)
                    VALUES (%s, %s, %s, %s, 'Packaged')
                """, (new_batch_id, target_type, grade, output_weight))
                
                # Log Production Run
                cur.execute("""
                    INSERT INTO production_runs (input_batch_id, output_pulse_type, input_weight, yield_weight, waste_weight, efficiency_percent)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (batch_id, target_type, input_weight, output_weight, waste_weight, yield_percent * 100))
                
                conn.commit()
                return f"Processed {input_weight}kg of {input_pulse} ({batch_id}) into {output_weight}kg of {target_type} ({new_batch_id}). Yield: 85%."
                
            except Exception as e:
                conn.rollback()
                return f"Transaction Error: {str(e)}"
            finally:
                cur.close()
                conn.close()

        except Exception as e:
            return f"System Error: {str(e)}"
