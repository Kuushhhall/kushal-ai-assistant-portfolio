'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useVoiceActivity } from './use-voice-activity';
import { useSpeechRecognition } from './use-speech-recognition';
import { useMurfTTS } from './use-murf-tts';

type ConversationTurn = 'idle' | 'user' | 'ai-thinking' | 'ai-speaking';

interface UseVoiceConversationOptions {
    onError?: (error: string) => void;
}

interface UseVoiceConversationReturn {
    // State
    turn: ConversationTurn;
    userAudioLevel: number;
    aiAudioLevel: number;
    transcript: string;
    aiResponse: string;
    isListening: boolean;
    isSpeechSupported: boolean;
    isTTSConfigured: boolean;
    error: string | null;

    // Messages history
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;

    // Controls
    startConversation: () => Promise<void>;
    stopConversation: () => void;
    interruptAI: () => void;
}

export function useVoiceConversation(options: UseVoiceConversationOptions = {}): UseVoiceConversationReturn {
    const { onError } = options;

    const [turn, setTurn] = useState<ConversationTurn>('idle');
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [error, setError] = useState<string | null>(null);

    const pendingTranscriptRef = useRef('');
    const isProcessingRef = useRef(false);

    // AI Chat hook
    const {
        messages,
        append,
        isLoading: isChatLoading,
    } = useChat({
        onFinish: (message) => {
            if (message.role === 'assistant' && message.content) {
                setAiResponse(message.content);
                // Speak the AI response
                tts.speak(message.content);
            }
        },
        onError: (err) => {
            const message = err.message || 'Chat error';
            setError(message);
            onError?.(message);
            setTurn('idle');
        },
        body: { isVoiceMode: true },
    });

    // Voice Activity Detection
    const vad = useVoiceActivity({
        silenceThreshold: 0.02,
        silenceDuration: 600, // 600ms silence = end of speech
        onSpeechStart: () => {
            // If AI is speaking, interrupt it
            if (turn === 'ai-speaking') {
                tts.stop();
            }
            setTurn('user');
        },
        onSpeechEnd: () => {
            // User stopped speaking, send to AI
            if (pendingTranscriptRef.current.trim() && !isProcessingRef.current) {
                isProcessingRef.current = true;
                const userMessage = pendingTranscriptRef.current.trim();
                setTranscript(userMessage);
                setTurn('ai-thinking');

                // Send to AI
                append({
                    role: 'user',
                    content: userMessage,
                });

                // Reset transcript
                pendingTranscriptRef.current = '';
                speech.resetTranscript();
            }
        },
    });

    // Speech Recognition
    const speech = useSpeechRecognition({
        language: 'en-US',
        continuous: true,
        interimResults: true,
        onResult: (text, isFinal) => {
            if (isFinal) {
                pendingTranscriptRef.current += text;
            }
            setTranscript(pendingTranscriptRef.current + (isFinal ? '' : text));
        },
        onError: (err) => {
            setError(err);
            onError?.(err);
        },
    });

    // Murf TTS
    const tts = useMurfTTS({
        onStart: () => {
            setTurn('ai-speaking');
            isProcessingRef.current = false;
        },
        onEnd: () => {
            setTurn('idle');
            setAiResponse('');
        },
        onError: (err) => {
            setError(err);
            onError?.(err);
            setTurn('idle');
            isProcessingRef.current = false;
        },
    });

    // Update turn when chat is loading
    useEffect(() => {
        if (isChatLoading && turn !== 'ai-thinking') {
            setTurn('ai-thinking');
        }
    }, [isChatLoading, turn]);

    // Destructure stable functions from hooks
    const { startListening: startVad, stopListening: stopVad, isListening: isVadListening, audioLevel: userAudioLevel } = vad;
    const { startListening: startSpeech, stopListening: stopSpeech, resetTranscript: resetSpeech, isSupported: isSpeechSupported } = speech;
    const { stop: stopTts, speak: speakTts, isConfigured: isTtsConfigured, audioLevel: aiAudioLevel } = tts;

    const startConversation = useCallback(async () => {
        setError(null);
        setTranscript('');
        setAiResponse('');
        pendingTranscriptRef.current = '';
        isProcessingRef.current = false;

        try {
            await startVad();
            startSpeech();
            setTurn('idle');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to start conversation';
            setError(message);
            onError?.(message);
        }
    }, [startVad, startSpeech, onError]);

    const stopConversation = useCallback(() => {
        stopVad();
        stopSpeech();
        stopTts();
        setTurn('idle');
        setTranscript('');
        setAiResponse('');
        pendingTranscriptRef.current = '';
        isProcessingRef.current = false;
    }, [stopVad, stopSpeech, stopTts]);

    const interruptAI = useCallback(() => {
        if (turn === 'ai-speaking' || turn === 'ai-thinking') {
            stopTts();
            setTurn('idle');
            setAiResponse('');
        }
    }, [turn, stopTts]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            vad.stopListening();
            speech.stopListening();
            tts.stop();
        };
    }, []);

    return {
        turn,
        userAudioLevel: vad.audioLevel,
        aiAudioLevel: tts.audioLevel,
        transcript,
        aiResponse,
        isListening: vad.isListening,
        isSpeechSupported: speech.isSupported,
        isTTSConfigured: tts.isConfigured,
        error,
        messages: messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        startConversation,
        stopConversation,
        interruptAI,
    };
}
