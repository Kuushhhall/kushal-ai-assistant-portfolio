import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Default to a good free voice - "Rachel" is clear and natural
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

export async function POST(request: NextRequest) {
    try {
        const { text, voiceId } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
            return NextResponse.json(
                { error: 'ElevenLabs API key not configured. Add ELEVENLABS_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        const selectedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

        // Use streaming endpoint with turbo model for low latency
        const response = await fetch(
            `${ELEVENLABS_API_URL}/${selectedVoiceId}/stream?output_format=mp3_44100_128`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_turbo_v2_5', // Flash/Turbo model for lowest latency (~75ms)
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.0,
                        use_speaker_boost: true,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[ELEVENLABS-STREAM] API error:', response.status, errorText);

            // Parse error for better user feedback
            let errorMessage = `ElevenLabs API error: ${response.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.detail?.message) {
                    errorMessage = errorJson.detail.message;
                }
            } catch {
                // Use generic message
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        // Stream the audio response back to the client
        const headers = new Headers({
            'Content-Type': 'audio/mpeg',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
        });

        // Return streaming response
        return new Response(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('[ELEVENLABS-STREAM] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
