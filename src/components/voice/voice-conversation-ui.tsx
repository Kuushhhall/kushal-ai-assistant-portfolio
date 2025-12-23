'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, AlertCircle } from 'lucide-react';
import React from 'react';
import { WaveformVisualizer } from './waveform-visualizer';
import { LiveTranscript } from './live-transcript';
import { useVoiceConversation } from '@/hooks/use-voice-conversation';

interface VoiceConversationUIProps {
    onClose?: () => void;
}

export function VoiceConversationUI({ onClose }: VoiceConversationUIProps) {
    const {
        turn,
        userAudioLevel,
        aiAudioLevel,
        transcript,
        aiResponse,
        isListening,
        isSpeechSupported,
        isTTSConfigured,
        error,
        messages,
        startConversation,
        stopConversation,
        interruptAI,
    } = useVoiceConversation();

    const handleToggle = () => {
        if (isListening) {
            stopConversation();
        } else {
            startConversation();
        }
    };

    // Show unsupported browser message
    if (!isSpeechSupported) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                <AlertCircle className="w-16 h-16 text-amber-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Voice Not Supported</h2>
                <p className="text-gray-400 max-w-md">
                    Your browser doesn&apos;t support speech recognition. Please use Chrome, Edge, or Safari for the voice conversation feature.
                </p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        Go Back
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-[600px] p-6">
            {/* API Configuration Warning */}
            <AnimatePresence>
                {isListening && !isTTSConfigured && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-4 left-4 right-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-200 text-sm flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>ElevenLabs not configured. Add ELEVENLABS_API_KEY to .env.local for voice responses.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-4 left-4 right-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Status */}
            <div className="text-center mb-8">
                <motion.h1
                    className="text-2xl font-bold mb-2"
                    animate={{ opacity: isListening ? 1 : 0.5 }}
                >
                    Voice Conversation
                </motion.h1>
                <motion.p
                    className="text-sm text-gray-400"
                    key={turn}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {!isListening && 'Tap to start listening'}
                    {turn === 'idle' && isListening && 'Listening for your voice...'}
                    {turn === 'user' && 'You are speaking...'}
                    {turn === 'ai-thinking' && 'AI is thinking...'}
                    {turn === 'ai-speaking' && 'AI is speaking...'}
                </motion.p>
            </div>

            {/* Waveform Visualizers */}
            <div className="flex-1 flex items-center justify-center w-full max-w-3xl">
                <div className="flex items-center justify-between w-full px-8">
                    {/* User Waveform (Left) */}
                    <motion.div
                        className="flex flex-col items-center"
                        animate={{
                            opacity: turn === 'user' || turn === 'idle' ? 1 : 0.4,
                            scale: turn === 'user' ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <WaveformVisualizer
                            audioLevel={userAudioLevel}
                            isActive={turn === 'user'}
                            variant="user"
                            state={turn === 'user' ? 'active' : 'idle'}
                            size="lg"
                        />
                    </motion.div>

                    {/* Center Connection Line */}
                    <div className="flex-1 mx-8">
                        <svg className="w-full h-4" preserveAspectRatio="none">
                            <motion.line
                                x1="0%"
                                y1="50%"
                                x2="100%"
                                y2="50%"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="8 4"
                                className="text-white/20"
                                animate={{
                                    strokeDashoffset: [0, 24],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                        </svg>
                    </div>

                    {/* AI Waveform (Right) */}
                    <motion.div
                        className="flex flex-col items-center"
                        animate={{
                            opacity: turn === 'ai-speaking' || turn === 'ai-thinking' ? 1 : 0.4,
                            scale: turn === 'ai-speaking' ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <WaveformVisualizer
                            audioLevel={aiAudioLevel}
                            isActive={turn === 'ai-speaking'}
                            variant="ai"
                            state={turn === 'ai-thinking' ? 'thinking' : turn === 'ai-speaking' ? 'active' : 'idle'}
                            size="lg"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Live Transcript */}
            <div className="w-full max-w-2xl my-8">
                <LiveTranscript
                    userTranscript={transcript}
                    aiResponse={aiResponse}
                    turn={turn}
                    previousMessages={messages.slice(-4)} // Pass previous messages here
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {/* Interrupt Button (when AI is speaking) */}
                <AnimatePresence>
                    {turn === 'ai-speaking' && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={interruptAI}
                            className="p-4 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                            title="Interrupt AI"
                        >
                            <MicOff className="w-6 h-6" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Main Toggle Button */}
                <motion.button
                    onClick={handleToggle}
                    className={`p-6 rounded-full transition-all ${isListening
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isListening ? (
                        <PhoneOff className="w-8 h-8" />
                    ) : (
                        <Phone className="w-8 h-8" />
                    )}
                </motion.button>

                {/* Microphone Status */}
                <motion.div
                    className={`p-4 rounded-full ${isListening
                        ? turn === 'user'
                            ? 'bg-indigo-500/30 text-indigo-300'
                            : 'bg-white/10 text-white/50'
                        : 'bg-white/5 text-white/30'
                        }`}
                    animate={{
                        scale: turn === 'user' ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: turn === 'user' ? Infinity : 0,
                    }}
                >
                    <Mic className="w-6 h-6" />
                </motion.div>
            </div>

            {/* Back Button */}
            {onClose && (
                <motion.button
                    onClick={() => {
                        stopConversation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Chat
                </motion.button>
            )}
        </div>
    );
}
