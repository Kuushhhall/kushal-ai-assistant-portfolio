'use client';

import { useRouter } from 'next/navigation';
import { VoiceConversationUI } from '@/components/voice/voice-conversation-ui';

export default function VoicePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Ambient background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            {/* Voice Conversation Interface */}
            <div className="relative z-10 container mx-auto max-w-4xl pt-12">
                <VoiceConversationUI onClose={() => router.push('/chat')} />
            </div>
        </main>
    );
}
