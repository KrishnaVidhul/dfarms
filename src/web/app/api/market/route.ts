import { NextResponse } from 'next/server';
import { getMarketPricesByFilters, getUniqueCommodities, getUniqueStates, getPriceTrends, getMarketStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        // Handle different actions
        switch (action) {
            case 'commodities':
                const commodities = await getUniqueCommodities();
                return NextResponse.json({ commodities });

            case 'states':
                const states = await getUniqueStates();
                return NextResponse.json({ states });

            case 'trends':
                const commodity = searchParams.get('commodity');
                const days = parseInt(searchParams.get('days') || '30');
                if (!commodity) {
                    return NextResponse.json({ error: 'Commodity parameter required' }, { status: 400 });
                }
                const trends = await getPriceTrends(commodity, days);
                return NextResponse.json({ trends });

            case 'stats':
                const stats = await getMarketStats();
                return NextResponse.json({ stats });

            case 'prices':
            default:
                // Get filtered prices
                const filters = {
                    commodity: searchParams.get('commodity') || undefined,
                    state: searchParams.get('state') || undefined,
                    startDate: searchParams.get('startDate') || undefined,
                    endDate: searchParams.get('endDate') || undefined,
                    limit: parseInt(searchParams.get('limit') || '500')
                };

                const prices = await getMarketPricesByFilters(filters);
                const response = NextResponse.json({
                    prices,
                    count: prices.length,
                    filters
                });

                // Prevent any caching
                response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                response.headers.set('Pragma', 'no-cache');
                response.headers.set('Expires', '0');

                return response;
        }
    } catch (error: any) {
        console.error('Market API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch market data',
            details: error.message
        }, { status: 500 });
    }
}
