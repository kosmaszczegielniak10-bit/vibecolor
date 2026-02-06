'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, FileCode, Check } from 'lucide-react';
import { exportAsCSS, exportAsJSON, downloadFile } from '@/lib/colorUtils';
import type { Color } from '@/store/paletteStore';

interface ExportMenuProps {
    colors: Color[];
    theme: string;
}

export default function ExportMenu({ colors, theme }: ExportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [exported, setExported] = useState(false);

    const handleExportCSS = () => {
        const css = exportAsCSS(colors);
        const filename = `${theme.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
        downloadFile(css, filename, 'text/css');
        showExportedFeedback();
    };

    const handleExportJSON = () => {
        const json = exportAsJSON(colors);
        const filename = `${theme.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
        downloadFile(json, filename, 'application/json');
        showExportedFeedback();
    };

    const showExportedFeedback = () => {
        setExported(true);
        setTimeout(() => {
            setExported(false);
            setIsOpen(false);
        }, 2000);
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="btn-primary w-full sm:w-auto mx-auto flex items-center justify-center gap-2"
            >
                {exported ? (
                    <>
                        <Check className="w-5 h-5" />
                        Exported!
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        Export Palette
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && !exported && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 glass rounded-xl p-2 min-w-[200px] z-50"
                    >
                        <button
                            onClick={handleExportCSS}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <FileCode className="w-5 h-5 text-primary" />
                            <div className="text-left">
                                <div className="font-medium">Export as CSS</div>
                                <div className="text-xs text-foreground-secondary">CSS Variables</div>
                            </div>
                        </button>

                        <button
                            onClick={handleExportJSON}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <FileJson className="w-5 h-5 text-accent" />
                            <div className="text-left">
                                <div className="font-medium">Export as JSON</div>
                                <div className="text-xs text-foreground-secondary">Data Format</div>
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
