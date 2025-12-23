'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioLevelSmoother } from '@/lib/audio-utils';

interface UseVoiceActivityOptions {
    silenceThreshold?: number; // 0-1, below this is silence
    silenceDuration?: number; // ms to wait before declaring silence
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
}

interface UseVoiceActivityReturn {
    isListening: boolean;
    isSpeaking: boolean;
    audioLevel: number;
    startListening: () => Promise<void>;
    stopListening: () => void;
}

export function useVoiceActivity(options: UseVoiceActivityOptions = {}): UseVoiceActivityReturn {
    const {
        silenceThreshold = 0.05,
        silenceDuration = 1000,
        onSpeechStart,
        onSpeechEnd,
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isSpeakingRef = useRef(false);
    const levelSmootherRef = useRef<AudioLevelSmoother>(new AudioLevelSmoother(0.1));

    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (microphoneRef.current) {
            microphoneRef.current.disconnect();
            microphoneRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        setIsListening(false);
        setIsSpeaking(false);
        setAudioLevel(0);
        isSpeakingRef.current = false;
        levelSmootherRef.current.reset();
    }, []);

    const startListening = useCallback(async () => {
        try {
            cleanup();

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 512;
            analyserRef.current.smoothingTimeConstant = 0.3;

            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            microphoneRef.current.connect(analyserRef.current);

            setIsListening(true);
            monitorAudio();
        } catch (err) {
            console.error('Failed to access microphone:', err);
            throw err;
        }
    }, [cleanup]);

    const stopListening = useCallback(() => {
        cleanup();
    }, [cleanup]);

    const monitorAudio = useCallback(() => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const checkAudioLevel = () => {
            if (!analyserRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);

            // Calculate average volume
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalizedLevel = average / 255;

            // Smooth the level for UI
            const smoothedLevel = levelSmootherRef.current.update(normalizedLevel);
            setAudioLevel(smoothedLevel);

            // VAD Logic
            if (normalizedLevel > silenceThreshold) {
                // Speech detected
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                }

                if (!isSpeakingRef.current) {
                    isSpeakingRef.current = true;
                    setIsSpeaking(true);
                    onSpeechStart?.();
                }
            } else if (isSpeakingRef.current) {
                // Silence detected while speaking
                if (!silenceTimerRef.current) {
                    silenceTimerRef.current = setTimeout(() => {
                        isSpeakingRef.current = false;
                        setIsSpeaking(false);
                        onSpeechEnd?.();
                    }, silenceDuration);
                }
            }

            animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();
    }, [silenceThreshold, silenceDuration, onSpeechStart, onSpeechEnd]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        isListening,
        isSpeaking,
        audioLevel,
        startListening,
        stopListening,
    };
}
