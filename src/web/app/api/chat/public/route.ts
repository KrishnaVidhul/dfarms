import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 });
        }

        // Paths (Mapped in Docker)
        // IPC folder is mounted at /app/ipc in both containers via docker-compose.yml
        const reqFile = '/app/ipc/sales_query.json';
        const resFile = '/app/ipc/sales_response.json';

        // 1. Write Request
        fs.writeFileSync(reqFile, JSON.stringify({ message }));

        // 2. Poll for Response (Max 10s)
        let attempts = 0;
        while (attempts < 20) {
            if (fs.existsSync(resFile)) {
                const data = fs.readFileSync(resFile, 'utf-8');
                const json = JSON.parse(data);

                // Cleanup Response (Agent cleans Request)
                fs.unlinkSync(resFile);

                return NextResponse.json({ response: json.response });
            }
            await new Promise(r => setTimeout(r, 500));
            attempts++;
        }

        return NextResponse.json({ error: 'Agent timed out' }, { status: 504 });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
