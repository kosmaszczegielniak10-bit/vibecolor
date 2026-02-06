'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ChevronDown, RotateCcw, Sparkles } from 'lucide-react';
import ColorCard from './ColorCard';
import ExportMenu from './ExportMenu';
import type { Palette } from '@/store/paletteStore';

interface PaletteDisplayProps {
    palette: Palette;
    onReset: () => void;
    onRefine: (hint: string) => void;
    isRefining?: boolean;
    hasUploadedImage?: boolean;
}

export default function PaletteDisplay({ palette, onReset, onRefine, isRefining = false, hasUploadedImage = false }: PaletteDisplayProps) {
    const [showAccessibility, setShowAccessibility] = useState(false);
    const [refineHint, setRefineHint] = useState('');

    const handleRefine = () => {
        if (refineHint.trim()) {
            onRefine(refineHint.trim());
            setRefineHint(''); // Clear after refining
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-7xl space-y-8"
        >
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center glass rounded-3xl p-8"
            >
                <h2 className="text-5xl font-bold mb-4">
                    <span className="gradient-text">{palette.theme}</span>
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {palette.mood && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-lg text-foreground-secondary">Mood:</span>
                            <span className="text-xl text-foreground font-medium italic">{palette.mood}</span>
                        </div>
                    )}

                    {hasUploadedImage && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
                            <span className="text-lg">📸</span>
                            <span className="text-lg text-foreground font-medium">From Image</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Color Grid - Larger cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {palette.colors.map((color, index) => (
                    <ColorCard key={`${color.hex}-${index}`} color={color} index={index} />
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <ExportMenu colors={palette.colors} theme={palette.theme} />

                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                    New Palette
                </motion.button>
            </div>

            {/* Refinement Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-3xl p-8"
            >
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Refine This Palette
                    </h3>
                    <p className="text-foreground-secondary mb-6">
                        Add hints to adjust the palette (e.g., "more vibrant", "cooler tones", "add purple")
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={refineHint}
                            onChange={(e) => setRefineHint(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleRefine()}
                            placeholder="e.g., more vibrant, cooler tones, add purple..."
                            className="input-premium flex-1"
                            disabled={isRefining}
                        />
                        <button
                            onClick={handleRefine}
                            disabled={isRefining || !refineHint.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-6"
                        >
                            {isRefining ? (
                                <>
                                    <div className="loading-spinner w-5 h-5" />
                                    Refining...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Refine
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Accessibility Information - Collapsible */}
            {palette.contrast_info && palette.contrast_info.length > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-3xl overflow-hidden"
                >
                    <button
                        onClick={() => setShowAccessibility(!showAccessibility)}
                        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/20">
                                <Info className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-bold">Accessibility Analysis</h3>
                                <p className="text-foreground-secondary text-sm mt-1">
                                    WCAG contrast ratios • Click to {showAccessibility ? 'hide' : 'view'}
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            className={`w-6 h-6 text-foreground-secondary transition-transform duration-300 ${showAccessibility ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {showAccessibility && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-8 pb-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {palette.contrast_info.map((contrast, index) => (
                                    <div key={index} className="p-5 rounded-2xl bg-background-secondary/50 border border-white/5 hover:border-primary/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-foreground-secondary text-sm font-medium">
                                                Color {index + 1} ↔ {index + 2}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono font-bold text-2xl text-primary">
                                                    {contrast.ratio}:1
                                                </div>
                                                <div className="text-xs text-foreground-secondary mt-1">
                                                    Contrast Ratio
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className={`px-3 py-2 rounded-lg text-center font-medium ${contrast.aa_normal ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                                <div className="font-bold mb-1">{contrast.aa_normal ? '✓' : '✗'} AA</div>
                                                <div className="opacity-80">Normal</div>
                                            </div>
                                            <div className={`px-3 py-2 rounded-lg text-center font-medium ${contrast.aa_large ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                                <div className="font-bold mb-1">{contrast.aa_large ? '✓' : '✗'} AA</div>
                                                <div className="opacity-80">Large</div>
                                            </div>
                                            <div className={`px-3 py-2 rounded-lg text-center font-medium ${contrast.aaa_normal ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                                <div className="font-bold mb-1">{contrast.aaa_normal ? '✓' : '✗'} AAA</div>
                                                <div className="opacity-80">Normal</div>
                                            </div>
                                            <div className={`px-3 py-2 rounded-lg text-center font-medium ${contrast.aaa_large ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                                <div className="font-bold mb-1">{contrast.aaa_large ? '✓' : '✗'} AAA</div>
                                                <div className="opacity-80">Large</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
