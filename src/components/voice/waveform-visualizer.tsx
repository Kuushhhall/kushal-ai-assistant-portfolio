'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface WaveformVisualizerProps {
    audioLevel: number;
    isActive: boolean;
    variant: 'user' | 'ai';
    state?: 'idle' | 'active' | 'thinking';
    size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
    sm: 80,
    md: 120,
    lg: 160,
};

const VARIANT_COLORS = {
    user: {
        primary: '#6366f1', // Indigo
        secondary: '#818cf8',
        glow: 'rgba(99, 102, 241, 0.4)',
    },
    ai: {
        primary: '#10b981', // Emerald
        secondary: '#34d399',
        glow: 'rgba(16, 185, 129, 0.4)',
    },
};

export function WaveformVisualizer({
    audioLevel,
    isActive,
    variant,
    state = isActive ? 'active' : 'idle',
    size = 'md',
}: WaveformVisualizerProps) {
    const baseSize = SIZE_MAP[size];
    const colors = VARIANT_COLORS[variant];

    // Calculate dynamic sizes based on audio level
    const scale = isActive ? 1 + audioLevel * 0.3 : 1;
    const pulseScale = state === 'thinking' ? [1, 1.1, 1] : 1;

    // Number of bars in the waveform
    const barCount = 12;
    const bars = Array.from({ length: barCount }, (_, i) => {
        const angle = (i / barCount) * Math.PI * 2;
        const baseHeight = 0.3 + Math.sin(angle * 2) * 0.2;
        const dynamicHeight = isActive ? baseHeight + audioLevel * (0.4 + Math.random() * 0.2) : baseHeight;
        return {
            rotation: (i / barCount) * 360,
            height: Math.min(1, dynamicHeight),
        };
    });

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: baseSize, height: baseSize }}
        >
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                    opacity: isActive ? [0.3, 0.5, 0.3] : 0.1,
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                }}
            />

            {/* Main orb */}
            <motion.div
                className="absolute rounded-full"
                animate={{
                    scale: state === 'thinking' ? pulseScale : scale,
                }}
                transition={{
                    duration: state === 'thinking' ? 1.5 : 0.1,
                    repeat: state === 'thinking' ? Infinity : 0,
                    ease: 'easeInOut',
                }}
                style={{
                    width: baseSize * 0.6,
                    height: baseSize * 0.6,
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    boxShadow: isActive ? `0 0 ${20 + audioLevel * 30}px ${colors.glow}` : `0 0 10px ${colors.glow}`,
                }}
            />

            {/* Waveform bars */}
            {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {bars.map((bar, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                width: 4,
                                height: baseSize * 0.3 * bar.height,
                                borderRadius: 2,
                                background: colors.secondary,
                                transformOrigin: 'center bottom',
                                transform: `rotate(${bar.rotation}deg) translateY(-${baseSize * 0.35}px)`,
                                opacity: 0.8,
                            }}
                            animate={{
                                scaleY: [1, 1 + audioLevel * 0.5, 1],
                            }}
                            transition={{
                                duration: 0.15 + Math.random() * 0.1,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.02,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Idle pulse ring */}
            {state === 'idle' && (
                <motion.div
                    className="absolute rounded-full border-2"
                    style={{
                        width: baseSize * 0.75,
                        height: baseSize * 0.75,
                        borderColor: colors.primary,
                        opacity: 0.3,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            )}

            {/* Thinking indicator */}
            {state === 'thinking' && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{ background: colors.secondary }}
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </motion.div>
            )}

            {/* Label */}
            <motion.span
                className="absolute -bottom-6 text-xs font-medium opacity-60"
                style={{ color: colors.primary }}
            >
                {variant === 'user' ? 'You' : 'AI'}
            </motion.span>
        </div>
    );
}
