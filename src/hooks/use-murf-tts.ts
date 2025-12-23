'use client';

import { useCallback, useRef, useState } from 'react';
import { AudioLevelSmoother } from '@/lib/audio-utils';

type TTSStatus = 'idle' | 'loading' | 'playing' | 'error';

interface UseMurfTTSOptions {
    voiceId?: string;
    style?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
}

interface UseMurfTTSReturn {
    status: TTSStatus;
    audioLevel: number;
    error: string | null;
    speak: (text: string) => Promise<void>;
    stop: () => void;
    isConfigured: boolean;
}

export function useMurfTTS(options: UseMurfTTSOptions = {}): UseMurfTTSReturn {
    const {
        voiceId,
        style,
        onStart,
        onEnd,
        onError,
    } = options;

    const [status, setStatus] = useState<TTSStatus>('idle');
    const [audioLevel, setAudioLevel] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isConfigured, setIsConfigured] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const levelSmootherRef = useRef<AudioLevelSmoother>(new AudioLevelSmoother(0.2));

    const cleanup = useCallback(() => {
        // Stop animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Stop audio source
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
            } catch {
                // Already stopped
            }
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }

        // Abort fetch
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        levelSmootherRef.current.reset();
        setAudioLevel(0);
    }, []);

    const monitorAudioLevel = useCallback(() => {
        if (!analyserRef.current || status !== 'playing') {
            setAudioLevel(0);
            return;
        }

        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const monitor = () => {
            if (status !== 'playing' || !analyserRef.current) {
                setAudioLevel(0);
                return;
            }

            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
            const normalizedLevel = average / 255;
            const smoothedLevel = levelSmootherRef.current.update(normalizedLevel);

            setAudioLevel(smoothedLevel);
            animationFrameRef.current = requestAnimationFrame(monitor);
        };

        monitor();
    }, [status]);

    const speak = useCallback(async (text: string) => {
        if (!text.trim()) return;

        cleanup();
        setError(null);
        setStatus('loading');

        try {
            abortControllerRef.current = new AbortController();

            // Fetch audio from our API
            const response = await fetch('/api/voice/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    voiceId,
                    style,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error: ${response.status}`);
            }

            // Check if API is configured
            if (response.headers.get('content-type')?.includes('application/json')) {
                try {
                    const data = await response.json();
                    if (data.error) {
                        if (data.error.includes('not configured')) {
                            setIsConfigured(false);
                        }
                        throw new Error(data.error);
                    }
                } catch (e) {
                    // Start reading as logic since might not be json despite header
                    if (e instanceof Error && !e.message.includes('not configured')) {
                        console.warn('Failed to parse error JSON:', e);
                    }
                    if (response.ok) {
                        // If response is ok but json failed, it might be audio? 
                        // But we checked header. Proceed cautiously.
                    } else {
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                }
            }

            setIsConfigured(true);

            // Get audio data
            const arrayBuffer = await response.arrayBuffer();

            // Create audio context if needed (44100Hz for MP3)
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext({ sampleRate: 44100 });
            }

            // Resume if suspended
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            // Create analyser
            if (!analyserRef.current) {
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                analyserRef.current.smoothingTimeConstant = 0.3;
                analyserRef.current.connect(audioContextRef.current.destination);
            }

            // Decode audio
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            // Create and play source
            sourceNodeRef.current = audioContextRef.current.createBufferSource();
            sourceNodeRef.current.buffer = audioBuffer;
            sourceNodeRef.current.connect(analyserRef.current);

            sourceNodeRef.current.onended = () => {
                cleanup();
                setStatus('idle');
                onEnd?.();
            };

            setStatus('playing');
            onStart?.();
            sourceNodeRef.current.start();

            // Start level monitoring
            monitorAudioLevel();

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Intentional abort, not an error
                setStatus('idle');
                return;
            }

            const message = err instanceof Error ? err.message : 'Failed to generate speech';
            setError(message);
            setStatus('error');
            onError?.(message);
            console.error('[MurfTTS] Error:', err);
        }
    }, [voiceId, style, cleanup, onStart, onEnd, onError, monitorAudioLevel]);

    const stop = useCallback(() => {
        cleanup();
        setStatus('idle');
    }, [cleanup]);

    return {
        status,
        audioLevel,
        error,
        speak,
        stop,
        isConfigured,
    };
}
