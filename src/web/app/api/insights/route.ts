import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get AI insights for commodities
async function getInsights(commodity?: string) {
    try {
        let query = `
            SELECT 
                commodity,
                recommendation,
                confidence_score,
                current_price,
                target_price,
                stop_loss,
                key_factors,
                technical_data,
                ai_analysis,
                created_at
            FROM market_insights
            WHERE created_at >= NOW() - INTERVAL '24 hours'
        `;

        const params: any[] = [];

        if (commodity) {
            query += ' AND commodity ILIKE $1';
            params.push(`%${commodity}%`);
        }

        query += ' ORDER BY created_at DESC';

        const res = await pool.query(query, params);

        // Flatten multi-factor data from technical_data to top level
        return res.rows.map((row: any) => {
            const technicalData = row.technical_data || {};
            const multiFactorAnalysis = technicalData.multi_factor_analysis;
            const newsSentiment = technicalData.news_sentiment;

            // Remove nested multi-factor data from technical_data
            const cleanTechnicalData = { ...technicalData };
            delete cleanTechnicalData.multi_factor_analysis;
            delete cleanTechnicalData.news_sentiment;

            return {
                ...row,
                technical_data: cleanTechnicalData,
                multi_factor_analysis: multiFactorAnalysis,
                news_sentiment: newsSentiment
            };
        });
    } catch (err) {
        console.error('Error fetching insights:', err);
        return [];
    }
}

// Generate new insights (triggers AI agent)
async function generateInsights(commodity: string) {
    try {
        // Import market analysis tools
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);

        // Run market intelligence agent
        const command = `cd ${process.cwd()}/../../ && DATABASE_URL="${process.env.DATABASE_URL}" GROQ_API_KEY="${process.env.GROQ_API_KEY}" python3 src/agent_runtime/market_intel_agent.py`;

        // This would run the agent - for now, return a placeholder
        return {
            status: 'queued',
            message: 'Analysis queued. Results will be available shortly.'
        };
    } catch (err) {
        console.error('Error generating insights:', err);
        throw err;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const commodity = searchParams.get('commodity');

        switch (action) {
            case 'summary':
                // Get summary of all recent insights
                const allInsights = await getInsights();

                const summary = {
                    total_commodities: new Set(allInsights.map(i => i.commodity)).size,
                    buy_signals: allInsights.filter(i => i.recommendation === 'BUY').length,
                    sell_signals: allInsights.filter(i => i.recommendation === 'SELL').length,
                    hold_signals: allInsights.filter(i => i.recommendation === 'HOLD').length,
                    last_updated: allInsights[0]?.created_at || null,
                    insights: allInsights.slice(0, 10)
                };

                return NextResponse.json({ summary });

            case 'generate':
                if (!commodity) {
                    return NextResponse.json({ error: 'Commodity parameter required' }, { status: 400 });
                }
                const result = await generateInsights(commodity);
                return NextResponse.json({ result });

            default:
                // Get insights for specific commodity or all
                const insights = await getInsights(commodity || undefined);
                return NextResponse.json({
                    insights,
                    count: insights.length
                });
        }
    } catch (error: any) {
        console.error('Insights API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch insights',
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { commodity, recommendation, confidence_score, current_price, target_price, stop_loss, key_factors, technical_data, ai_analysis } = body;

        if (!commodity || !recommendation) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert insight into database
        const query = `
            INSERT INTO market_insights 
            (commodity, recommendation, confidence_score, current_price, target_price, stop_loss, key_factors, technical_data, ai_analysis, valid_until)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() + INTERVAL '24 hours')
            RETURNING *
        `;

        const res = await pool.query(query, [
            commodity,
            recommendation,
            confidence_score,
            current_price,
            target_price,
            stop_loss,
            JSON.stringify(key_factors),
            JSON.stringify(technical_data),
            ai_analysis
        ]);

        return NextResponse.json({
            success: true,
            insight: res.rows[0]
        });
    } catch (error: any) {
        console.error('Insights POST Error:', error);
        return NextResponse.json({
            error: 'Failed to save insight',
            details: error.message
        }, { status: 500 });
    }
}
