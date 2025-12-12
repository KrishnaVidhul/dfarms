
import os
import psycopg2
import numpy as np
from sklearn.linear_model import LinearRegression
try:
    from crewai.tools import BaseTool
except ImportError:
    try:
        from crewai_tools import BaseTool
    except ImportError:
        from langchain.tools import BaseTool

class PricePredictionTool(BaseTool):
    name: str = "Predict Price Trend"
    description: str = "Forecasts future price and trend for a pulse. Argument: pulse_type (str)."

    def _run(self, pulse_type: str) -> str:
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            
            # Fetch last 30 data points
            cur.execute("""
                SELECT price, fetched_at FROM market_prices 
                WHERE pulse_type ILIKE %s 
                ORDER BY fetched_at ASC 
                LIMIT 30
            """, (pulse_type,))
            
            rows = cur.fetchall()
            # Do NOT close connection here
            
            if len(rows) < 5:
                conn.close()
                return f"Insufficient data to predict for {pulse_type}. Need at least 5 records."
                
            # Parse Data
            prices = []
            days = []
            
            start_date = rows[0][1]
            
            import re
            for i, row in enumerate(rows):
                price_str = row[0]
                match = re.search(r'[\d.]+', price_str.replace(',', ''))
                if match:
                    price = float(match.group())
                    prices.append(price)
                    
                    # Convert date to Day number (0, 1, 2...)
                    delta = (row[1] - start_date).days
                    days.append(delta)

            # Linear Regression
            X = np.array(days).reshape(-1, 1)
            y = np.array(prices)
            
            model = LinearRegression()
            model.fit(X, y)
            
            # Predict Next Week (Last Day + 7)
            last_day = days[-1]
            future_day = np.array([[last_day + 7]])
            predicted_price = model.predict(future_day)[0]
            
            # Determine Trend
            current_price = prices[-1]
            if predicted_price > current_price * 1.02:
                trend = "UP"
            elif predicted_price < current_price * 0.98:
                trend = "DOWN"
            else:
                trend = "FLAT"

            # Update DB (Latest Record)
            try:
                # Find latest ID
                cur.execute("SELECT id FROM market_prices WHERE pulse_type ILIKE %s ORDER BY fetched_at DESC LIMIT 1", (pulse_type,))
                latest_id = cur.fetchone()[0]
                
                cur.execute("""
                    UPDATE market_prices 
                    SET predicted_next_week = %s, trend_direction = %s 
                    WHERE id = %s
                """, (predicted_price, trend, latest_id))
                conn.commit()
            except Exception as db_err:
                print(f"DB Update Error: {db_err}")
                
            return f"Market Intelligence for {pulse_type}:\nCurrent: ₹{current_price:.2f}\nForecast (7 Days): ₹{predicted_price:.2f}\nTrend: {trend}"

        except Exception as e:
            conn.rollback()
            return f"Prediction Error: {str(e)}"
        finally:
            if conn: conn.close()
