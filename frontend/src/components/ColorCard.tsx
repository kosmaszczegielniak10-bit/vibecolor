'use client';

import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard, getContrastingTextColor } from '@/lib/colorUtils';
import type { Color } from '@/store/paletteStore';

interface ColorCardProps {
    color: Color;
    index: number;
}

export default function ColorCard({ color, index }: ColorCardProps) {
    const [copied, setCopied] = useState(false);
    const textColor = getContrastingTextColor(color.hex);

    const handleCopy = async () => {
        const success = await copyToClipboard(color.hex);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
            }}
            className="color-card group"
            style={{ backgroundColor: color.hex, minHeight: '240px' }}
            onClick={handleCopy}
        >
            {/* Always visible bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <p className="font-mono text-lg font-bold text-white mb-1 drop-shadow-lg">
                    {color.hex}
                </p>
                {color.name && (
                    <p className="text-sm text-white/90 drop-shadow">
                        {color.name}
                    </p>
                )}
            </div>

            {/* Hover overlay with full details */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                style={{
                    backgroundColor: `${color.hex}f5`,
                    color: textColor,
                }}
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="mb-4"
                    >
                        {copied ? (
                            <div className="flex items-center justify-center gap-2">
                                <Check className="w-10 h-10" />
                                <span className="text-xl font-semibold">Copied!</span>
                            </div>
                        ) : (
                            <Copy className="w-10 h-10 mx-auto" />
                        )}
                    </motion.div>

                    {color.name && (
                        <h3 className="font-bold text-xl mb-3">
                            {color.name}
                        </h3>
                    )}

                    <p className="font-mono text-2xl font-bold mb-3 tracking-wide">
                        {color.hex}
                    </p>

                    <div className="space-y-1 text-sm opacity-90">
                        <p className="font-mono">
                            RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                    </div>

                    <p className="text-xs mt-4 opacity-70 font-medium">
                        {copied ? '✓ Copied to clipboard' : 'Click to copy'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
