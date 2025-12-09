import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { command } = await request.json();

        if (!command || typeof command !== 'string') {
            return NextResponse.json({ error: 'Command is required' }, { status: 400 });
        }

        // Write to the shared IPC file that super_agent.py watches
        const ipcDir = path.join(process.cwd(), 'ipc');
        if (!fs.existsSync(ipcDir)) {
            fs.mkdirSync(ipcDir, { recursive: true });
        }

        const filePath = path.join(ipcDir, 'internal_command.json');

        // Write as JSON object. Overwrite is acceptable as agent processes one at a time.
        const payload = {
            "command": command,
            "timestamp": new Date().toISOString()
        };

        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));

        console.log(`Command IPC sent: ${command}`);

        return NextResponse.json({ success: true, message: 'Command sent to Agent' });
    } catch (error) {
        console.error('Error writing command:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
