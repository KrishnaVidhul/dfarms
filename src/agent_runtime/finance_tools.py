
import os
import json
import psycopg2
from crewai.tools import BaseTool
import uuid
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

class InvoiceGeneratorTool(BaseTool):
    name: str = "Generate Invoice"
    description: str = "Generates a PDF invoice. Inputs: 'customer_name' (str), 'items' (list of dicts with 'item', 'weight_kg', 'price_per_kg')."

    def _run(self, customer_name: str, items: list) -> str:
        print(f"DEBUG: Finance Tool Called - Customer: {customer_name}, Items: {len(items)}")
        try:
            if not items:
                return "Error: No items provided for invoice."

            # Setup Invoice Data
            invoice_number = f"INV-{uuid.uuid4().hex[:6].upper()}"
            date_str = datetime.now().strftime("%Y-%m-%d")
            
            # Calculations
            subtotal = 0
            table_data = [['Item', 'Qty (kg)', 'Rate (₹)', 'Total (₹)']]
            
            for item in items:
                qty = float(item.get('weight_kg', 0))
                rate = float(item.get('price_per_kg', 0))
                line_total = qty * rate
                subtotal += line_total
                table_data.append([
                    item.get('item', 'Unknown Pulse'),
                    f"{qty:.2f}",
                    f"{rate:.2f}",
                    f"{line_total:.2f}"
                ])

            tax_rate = 0.05  # 5% GST on Pulses
            tax_amount = subtotal * tax_rate
            total_amount = subtotal + tax_amount

            # PDF Generation
            pdf_filename = f"{invoice_number}.pdf"
            pdf_dir = "/app/src/web/public/invoices" # Shared Volume
            if not os.path.exists(pdf_dir):
                os.makedirs(pdf_dir)
            
            pdf_path = os.path.join(pdf_dir, pdf_filename)
            
            c = canvas.Canvas(pdf_path, pagesize=A4)
            width, height = A4
            
            # Header
            c.setFont("Helvetica-Bold", 20)
            c.drawString(50, height - 50, "D Farms - Digital Pulse Factory")
            c.setFont("Helvetica", 10)
            c.drawString(50, height - 65, "123 Agri Tech Park, Bangalore, India")
            c.drawString(50, height - 80, "GSTIN: 29ABCDE1234F1Z5")
            
            # Invoice Info
            c.setFont("Helvetica-Bold", 14)
            c.drawString(400, height - 50, "INVOICE")
            c.setFont("Helvetica", 10)
            c.drawString(400, height - 70, f"No: {invoice_number}")
            c.drawString(400, height - 85, f"Date: {date_str}")
            
            # Bill To
            c.drawString(50, height - 120, f"Bill To: {customer_name}")
            
            # Table
            table = Table(table_data, colWidths=[200, 80, 80, 100])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.grey),
                ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0,0), (-1,0), 12),
                ('BACKGROUND', (0,1), (-1,-1), colors.beige),
                ('GRID', (0,0), (-1,-1), 1, colors.black)
            ]))
            
            table.wrapOn(c, width, height)
            table.drawOn(c, 50, height - 300)
            
            # Totals
            y_pos = height - 350
            c.drawString(350, y_pos, f"Subtotal: ₹{subtotal:.2f}")
            c.drawString(350, y_pos - 15, f"GST (5%): ₹{tax_amount:.2f}")
            c.setFont("Helvetica-Bold", 12)
            c.drawString(350, y_pos - 35, f"Total: ₹{total_amount:.2f}")
            
            c.save()

            # Database Update
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            # 1. Record Invoice
            cur.execute("""
                INSERT INTO invoices (invoice_number, customer_name, items_json, tax_amount, total_amount, pdf_path)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (invoice_number, customer_name, json.dumps(items), tax_amount, total_amount, f"/invoices/{pdf_filename}"))
            
            # 2. Record Transaction (Income)
            cur.execute("""
                INSERT INTO transactions (type, category, amount, description)
                VALUES ('INCOME', 'SALES', %s, %s)
            """, (total_amount, f"Invoice {invoice_number} - {customer_name}"))
            
            # 3. Deduct Inventory
            stock_updates = []
            for item in items:
                item_name = item.get('item')
                qty = float(item.get('weight_kg', 0))
                
                # Check if item exists (Match pulse_type)
                # Note: This is a simplification. Ideally, we should pick specific batches (FIFO). 
                # For now, we deduct from any available batch of that type.
                cur.execute("UPDATE inventory SET weight_kg = weight_kg - %s WHERE pulse_type ILIKE %s AND weight_kg >= %s RETURNING weight_kg, id", (qty, f"%{item_name}%", qty))
                
                if cur.rowcount == 0:
                    stock_updates.append(f"WARNING: Insufficient stock for '{item_name}' (Type match). Inventory not deducted.")
                else:
                    row = cur.fetchone()
                    new_qty = row[0]
                    batch_pk = row[1]
                    stock_updates.append(f"Deducted {qty}kg of {item_name} from Batch ID {batch_pk}. New Balance: {new_qty}kg.")

            conn.commit()
            cur.close()
            conn.close()

            stock_msg = "\n".join(stock_updates)
            return f"Invoice {invoice_number} Generated. Total: ₹{total_amount:.2f}.\nPDF: /invoices/{pdf_filename}\nStock Updates:\n{stock_msg}"
            
        except Exception as e:
            return f"Invoice Generation Failed: {str(e)}"
