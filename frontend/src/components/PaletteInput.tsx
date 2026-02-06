'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, X } from 'lucide-react';

interface PaletteInputProps {
    onGenerate: (prompt: string, numColors: number, imageFile?: File) => void;
    isLoading: boolean;
}

const suggestions = [
    'sunset over the ocean',
    'corporate professional',
    'vintage jazz club',
    'cyberpunk neon city',
    'spring garden',
    'cozy coffee shop',
];

export default function PaletteInput({ onGenerate, isLoading }: PaletteInputProps) {
    const [prompt, setPrompt] = useState('');
    const [numColors, setNumColors] = useState(5);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate with either prompt or image (or both)
        if (prompt.trim() || selectedImage) {
            onGenerate(prompt, numColors, selectedImage || undefined);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass rounded-2xl p-8">
                    <label htmlFor="prompt" className="block text-sm font-medium mb-3 text-foreground-secondary">
                        Describe your vibe {selectedImage && '(optional with image)'}
                    </label>

                    <input
                        type="text"
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={selectedImage ? "Add text to refine colors from image..." : "e.g., sunset over ocean, minimalist corporate, vibrant festival..."}
                        className="input-premium"
                        disabled={isLoading}
                    />

                    {/* Image Preview */}
                    <AnimatePresence>
                        {selectedImage && imagePreview && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 relative"
                            >
                                <div className="relative rounded-xl overflow-hidden bg-background-secondary border border-glass-border">
                                    <img
                                        src={imagePreview}
                                        alt="Upload preview"
                                        className="w-full h-48 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                        <p className="text-white text-sm font-medium">{selectedImage.name}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                        {/* Better color count selector - slider with manual input */}
                        <div className="flex items-center gap-4 bg-black/20 border border-white/20 rounded-xl px-4 py-3">
                            <label htmlFor="numColors" className="text-sm text-foreground-secondary whitespace-nowrap">
                                Number of Colors:
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    id="numColors"
                                    min="3"
                                    max="15"
                                    value={numColors || 5}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setNumColors(isNaN(val) ? 5 : val);
                                    }}
                                    className="w-32 accent-primary cursor-pointer"
                                    disabled={isLoading}
                                />
                                <input
                                    type="number"
                                    min="3"
                                    max="15"
                                    value={numColors || 5}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setNumColors(isNaN(val) ? 5 : Math.min(15, Math.max(3, val)));
                                    }}
                                    className="w-12 h-12 rounded-xl bg-gradient-primary text-white font-bold text-xl text-center border-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg glass border transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${selectedImage ? 'border-primary bg-primary/10' : 'border-glass-border hover:border-primary'
                                    }`}
                            >
                                <Upload className="w-5 h-5" />
                                <span className="hidden sm:inline">{selectedImage ? 'Change Image' : 'Upload Image'}</span>
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading || (!prompt.trim() && !selectedImage)}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="loading-spinner w-5 h-5" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Palette
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm text-foreground-secondary">Try:</span>
                    {suggestions.map((suggestion) => (
                        <motion.button
                            key={suggestion}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 text-sm rounded-full glass border border-glass-border hover:border-primary transition-colors"
                            disabled={isLoading}
                        >
                            {suggestion}
                        </motion.button>
                    ))}
                </div>
            </form>
        </motion.div>
    );
}
