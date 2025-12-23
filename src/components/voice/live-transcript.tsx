'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface LiveTranscriptProps {
    userTranscript: string;
    aiResponse: string;
    turn: 'idle' | 'user' | 'ai-thinking' | 'ai-speaking';
    previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export function LiveTranscript({
    userTranscript,
    aiResponse,
    turn,
    previousMessages = [],
}: LiveTranscriptProps) {
    // Get last 2 messages for context
    const recentMessages = previousMessages.slice(-4);

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            {/* Previous messages - faded stack */}
            <AnimatePresence mode="popLayout">
                {recentMessages.map((msg, i) => (
                    <motion.div
                        key={`prev-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.3 - i * 0.1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-2 text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'
                            }`}
                    >
                        <span className="inline-block max-w-[80%] px-3 py-1 rounded-lg bg-white/5">
                            {msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content}
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Current user transcript */}
            <AnimatePresence mode="wait">
                {(turn === 'user' || (turn === 'ai-thinking' && userTranscript)) && userTranscript && (
                    <motion.div
                        key="user-transcript"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0.5, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 text-right"
                    >
                        <span className="inline-block max-w-[85%] px-4 py-2 rounded-2xl bg-indigo-500/20 text-indigo-200 text-lg">
                            {userTranscript}
                            {turn === 'user' && (
                                <motion.span
                                    className="inline-block w-2 h-4 ml-1 bg-indigo-400 rounded-sm"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                />
                            )}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI thinking indicator */}
            <AnimatePresence>
                {turn === 'ai-thinking' && !aiResponse && (
                    <motion.div
                        key="thinking"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-left"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300">
                            <motion.span
                                className="flex gap-1"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            </motion.span>
                            <span className="text-sm opacity-70">Thinking...</span>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI response */}
            <AnimatePresence mode="wait">
                {(turn === 'ai-speaking' || aiResponse) && aiResponse && (
                    <motion.div
                        key="ai-response"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0.5, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="text-left"
                    >
                        <span className="inline-block max-w-[85%] px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-200 text-lg">
                            {aiResponse}
                            {turn === 'ai-speaking' && (
                                <motion.span
                                    className="inline-block w-2 h-4 ml-1 bg-emerald-400 rounded-sm"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                            )}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Idle state hint */}
            <AnimatePresence>
                {turn === 'idle' && !userTranscript && !aiResponse && recentMessages.length === 0 && (
                    <motion.div
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-sm text-gray-400"
                    >
                        Start speaking to begin the conversation...
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
