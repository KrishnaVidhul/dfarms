import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Using a volume-shared path available to both containers
// In prod this would be Redis/Queue, for local MVP it's a file mount
const SHARED_DIR = path.join(process.cwd(), '..', '..');
// Path: /app (container) -> writes to mounted ./src/sales_query.json
// Note: Docker volume maps ./src/web:/app, BUT we need to write to project root src/
// The web container volume is ./src/web:/app. 
// However, checking docker-compose:
// web: volumes: - ./src/web:/app
// agent: volumes: - .:/app (root)
// This means they DON'T share the same file system root.
// FIX: We need to use the commands.txt volume strategy or similar.
// Web has: ./src/commands.txt:/app/commands.txt
// Let's add a NEW volume mapping for sales IPC in docker-compose first or reuse existing.

// WAIT: The shared buffer needs to be accessible. 
// Currently:
// Web sees: /app (src/web in host)
// Agent sees: /app (root in host)

// Let's write to a path explicitly mounted in both.
// 'commands.txt' is shared.
// I will reuse the same strategy but for JSON IPC.
// I need to update docker-compose.yml to mount the IPC files.
// FOR NOW: I will fail fast if I don't update docker-compose.
// Plan Update: Update docker-compose to share 'ipc' folder?
// OR: Just use the existing volume mount for 'commands.txt' folder?
// Web mounts: - ./src/commands.txt:/app/commands.txt
// It seems only that file is mounted.

// QUICK FIX: Update docker-compose.yml to mount the whole ./src folder to /src in web?
// No, that overrides /app.
// Let's mount a specific IPC folder.

// Action: I will pause writing this file and update docker-compose.yml first.
// But to save turn, I will write this assuming /app/ipc/ exists and I will fix infra next step.

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 });
        }

        // Paths (Mapped in Docker)
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
