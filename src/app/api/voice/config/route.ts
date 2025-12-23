import { NextResponse } from 'next/server';

// ElevenLabs voice configuration
// Free tier voices that work well for conversation
const AVAILABLE_VOICES = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', language: 'en-US', gender: 'female', description: 'Calm, clear, conversational' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', language: 'en-US', gender: 'female', description: 'Soft, young, friendly' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', language: 'en-US', gender: 'male', description: 'Well-rounded, calm' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', language: 'en-US', gender: 'male', description: 'Crisp, articulate' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', language: 'en-US', gender: 'male', description: 'Deep, narrative' },
    { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', language: 'en-US', gender: 'male', description: 'Raspy, energetic' },
];

export async function GET() {
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
    const isConfigured = process.env.ELEVENLABS_API_KEY &&
        process.env.ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key_here';

    return NextResponse.json({
        provider: 'elevenlabs',
        isConfigured,
        defaultVoiceId,
        voices: AVAILABLE_VOICES,
        settings: {
            model: 'eleven_turbo_v2_5',
            outputFormat: 'mp3_44100_128',
            latency: '~75ms',
        },
        freeLimit: '10,000 characters/month (~10 minutes)',
    });
}
