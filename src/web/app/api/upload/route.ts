
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as fs from 'fs';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to shared volume
        const uploadDir = join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            await fs.promises.mkdir(uploadDir, { recursive: true });
        }

        // Create unique filename
        const filename = `sample-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        console.log(`File saved to ${filepath}`);

        // Trigger Agent via IPC
        const agentPath = `/app/src/web/public/uploads/${filename}`;
        const ipcFile = join(process.cwd(), 'ipc/internal_command.json');

        const command = {
            // Use exact prompt structure the agent expects
            "command": `Analyze quality of image ${agentPath} for Batch-NEW-VISION.`
        };

        await writeFile(ipcFile, JSON.stringify(command));

        // Wait for Agent Response (SIMPLE POLLING)
        // In a real app we'd likely use websockets or just return "processing"
        // But for this demo, we can poll the response file for up to 20 seconds.

        const resFile = join(process.cwd(), 'ipc/internal_response.json');
        let attempts = 0;
        let analysisResult = null;

        while (attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            if (fs.existsSync(resFile)) {
                const content = fs.readFileSync(resFile, 'utf-8');
                try {
                    const jsonRes = JSON.parse(content);
                    // The Agent returns a string, we might need to parse IT if we want structured data
                    // but for now let's just pass the raw response text or see if we can extract JSON.
                    // The Vision Tool returns a string with "Grade: X". Let's parse that regex-style for the UI.

                    analysisResult = parseAgentResponse(jsonRes.response || "");
                    fs.unlinkSync(resFile); // Consume
                    break;
                } catch (e) {
                    console.error("Error parsing response:", e);
                }
            }
        }

        if (analysisResult) {
            return NextResponse.json({ success: true, analysis: analysisResult });
        } else {
            return NextResponse.json({ success: false, message: 'Agent timed out' }, { status: 504 });
        }

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper to make the string response from Agent into UI friendly JSON
function parseAgentResponse(text: string) {
    // Expected Tool Output: 
    // "Quality Analysis Complete (ID: 15):\nGrade: A\nDefects: {'broken': 5, ...}\nImage: ..."

    const gradeMatch = text.match(/Grade: ([A-C])/);
    const defectsMatch = text.match(/Defects: ({.*})/);

    let grade = gradeMatch ? gradeMatch[1] : '?';
    let defects = {};

    if (defectsMatch) {
        try {
            // Python dict string to JSON if possible (replace ' with ")
            const jsonStr = defectsMatch[1].replace(/'/g, '"');
            defects = JSON.parse(jsonStr);
        } catch (e) {
            defects = { summary: "Could not parse defects details." };
        }
    }

    return {
        grade,
        defects,
        raw: text
    };
}
