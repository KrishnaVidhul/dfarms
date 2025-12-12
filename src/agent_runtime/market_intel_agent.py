#!/usr/bin/env python3
"""
Market Intelligence Agent
Analyzes commodity price data and provides buy/sell recommendations using CrewAI
"""

import os
import sys
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
from datetime import datetime
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.market_analysis_tools import (
    analyze_price_trends,
    generate_buy_sell_signal,
    compare_state_prices
)

# Initialize LLM
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="mixtral-8x7b-32768",
    temperature=0.3
)

def create_market_analyst_agent():
    """Create the Market Intelligence Analyst agent"""
    return Agent(
        role='Chief Agricultural Economist & Predictive Strategist',
        goal='Analyze commodity trends, forecast future price movements (5-day outlook), and provide strategic buy/sell signals.',
        backstory="""You are the Chief Agricultural Economist for D-Farms, with elite expertise in:
        - Predictive Market Modeling & Time-Series Analysis
        - Macro-Economic Factors affecting Agri-Commodities (Global Supply, Weather, Policy)
        - Advanced Technical Analysis (RSI, Bollinger Bands, Moving Averages)
        - Risk-Adjusted Trading Strategies
        
        Your mission is not just to report what happened, but to PREDICT what will happen. 
        You analyze the last 5 days of high-frequency data to forecast the next trend. 
        Your insights determine the procurement strategy for thousands of farmers.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

def analyze_commodity(commodity: str) -> dict:
    """
    Analyze a specific commodity and generate recommendations
    
    Args:
        commodity: Commodity name (e.g., 'Wheat', 'Rice')
    
    Returns:
        Dict with analysis and recommendations
    """
    print(f"\n{'='*60}")
    print(f"Analyzing {commodity}")
    print(f"{'='*60}\n")
    
    # Get technical analysis
    print("📊 Performing technical analysis...")
    technical_analysis = analyze_price_trends(commodity)
    
    if 'error' in technical_analysis:
        return {
            'commodity': commodity,
            'status': 'error',
            'message': technical_analysis['error']
        }
    
    # Generate buy/sell signal
    print("🎯 Generating buy/sell recommendation...")
    signal = generate_buy_sell_signal(commodity)
    
    # Get state price comparison
    print("🗺️  Comparing prices across states...")
    state_comparison = compare_state_prices(commodity)
    
    # Create agent and task
    agent = create_market_analyst_agent()
    
    # Prepare context for agent
    context = f"""
    Commodity: {commodity}
    
    Technical Analysis:
    - Current Price: ₹{technical_analysis['current_price']}/quintal
    - 7-day Moving Average: ₹{technical_analysis['ma_7']}/quintal
    - 30-day Moving Average: ₹{technical_analysis['ma_30']}/quintal
    - Price Momentum (7-day): {technical_analysis['momentum']}%
    - Volatility: ₹{technical_analysis['volatility']}
    - Trend: {technical_analysis['trend']}
    - Support Level: ₹{technical_analysis['support']}
    - Resistance Level: ₹{technical_analysis['resistance']}
    - Price Change (period): {technical_analysis['price_change_pct']}%
    
    Automated Recommendation:
    - Signal: {signal['recommendation']}
    - Confidence: {signal['confidence']}%
    - Target Price: ₹{signal['target_price']}
    - Stop Loss: ₹{signal['stop_loss']}
    - Key Factors: {', '.join(signal['key_factors'])}
    
    State Price Comparison (Top 5):
    {json.dumps(state_comparison[:5], indent=2)}
    """
    
    # Create analysis task
    task = Task(
        description=f"""Analyze the market data for {commodity} and provide a comprehensive market intelligence report.
        
        Your report should include:
        1. Market Summary: Executive overview of the current sentiment.
        2. Technical Analysis: Deep dive into the numbers (RSI, MA, Momentum).
        3. 🔮 5-DAY PRICE PREDICTION: Forecast where the price is heading next week with confidence level.
        4. Strategic Recommendation: AGGRESSIVE BUY / ACCUMULATE / HOLD / PANIC SELL.
        5. Risk Assessment: What could go wrong? (Volatility check).
        
        Base your analysis on the following data:
        {context}
        
        Provide high-value, predictive intelligence that gives D-Farms a competitive edge.""",
        agent=agent,
        expected_output="A comprehensive market intelligence report with clear recommendations"
    )
    
    # Execute analysis
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=True
    )
    
    print("\n🤖 AI Agent analyzing market data...\n")
    result = crew.kickoff()
    
    # Combine all results
    return {
        'commodity': commodity,
        'status': 'success',
        'technical_analysis': technical_analysis,
        'recommendation': signal,
        'state_comparison': state_comparison[:5],
        'ai_analysis': str(result),
        'generated_at': datetime.now().isoformat()
    }

def analyze_multiple_commodities(commodities: list) -> dict:
    """
    Analyze multiple commodities and provide market overview
    
    Args:
        commodities: List of commodity names
    
    Returns:
        Dict with analysis for each commodity
    """
    results = {}
    
    for commodity in commodities:
        try:
            results[commodity] = analyze_commodity(commodity)
        except Exception as e:
            print(f"Error analyzing {commodity}: {e}")
            results[commodity] = {
                'commodity': commodity,
                'status': 'error',
                'message': str(e)
            }
    
    return results

def main():
    """Main execution function"""
    print("\n" + "="*60)
    print("Market Intelligence Agent")
    print("="*60 + "\n")
    
    # Check environment variables
    if not GROQ_API_KEY:
        print("ERROR: GROQ_API_KEY not set")
        sys.exit(1)
    
    # Analyze key commodities
    commodities = ['Wheat', 'Rice', 'Tur Dal', 'Soybean', 'Cotton']
    
    print(f"Analyzing {len(commodities)} commodities...\n")
    
    results = analyze_multiple_commodities(commodities)
    
    # Print summary
    print("\n" + "="*60)
    print("MARKET INTELLIGENCE SUMMARY")
    print("="*60 + "\n")
    
    for commodity, analysis in results.items():
        if analysis['status'] == 'success':
            rec = analysis['recommendation']
            print(f"📌 {commodity}:")
            print(f"   Recommendation: {rec['recommendation']}")
            print(f"   Confidence: {rec['confidence']}%")
            print(f"   Current Price: ₹{rec['current_price']}")
            print(f"   Target: ₹{rec['target_price']}")
            print()
        else:
            print(f"❌ {commodity}: {analysis.get('message', 'Analysis failed')}\n")
    
    print("="*60)
    print("Analysis complete!")
    print("="*60)

if __name__ == "__main__":
    main()
