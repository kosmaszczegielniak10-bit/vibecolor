'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PaletteInput from '../components/PaletteInput';
import PaletteDisplay from '../components/PaletteDisplay';
import InteractiveBackground from '../components/InteractiveBackground';
import { usePaletteStore } from '@/store/paletteStore';
import { paletteApi } from '@/lib/api';

export default function Home() {
  const { currentPalette, isLoading, setLoading, setPalette, setError, clearPalette } = usePaletteStore();
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null); // Remember the uploaded image

  const handleGeneratePalette = async (prompt: string, numColors: number, imageFile?: File) => {
    setLoading(true);
    setError(null);
    setOriginalPrompt(prompt || (imageFile ? `colors from ${imageFile.name}` : '')); // Store for refinement

    // Remember the image for future refinements
    if (imageFile) {
      setUploadedImage(imageFile);
    } else {
      setUploadedImage(null);
    }

    try {
      let palette;

      if (imageFile && prompt.trim()) {
        // Combined: Extract colors from image AND use text prompt
        // First extract colors
        const imagePalette = await paletteApi.extractColorsFromImage(imageFile, numColors);

        // Then refine with text prompt
        palette = await paletteApi.refinePalette({
          original_prompt: `colors from ${imageFile.name}`,
          refinement_hint: prompt,
          num_colors: numColors,
        });
      } else if (imageFile) {
        // Image only
        palette = await paletteApi.extractColorsFromImage(imageFile, numColors);
      } else {
        // Text only
        palette = await paletteApi.generatePalette({ prompt, num_colors: numColors });
      }

      setPalette(palette);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate palette. Please try again.');
      console.error('Error generating palette:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefinePalette = async (hint: string) => {
    setIsRefining(true);
    setError(null);

    try {
      let palette;

      if (uploadedImage) {
        // If we have an uploaded image, use it with the refinement hint
        // This gives the AI the actual image colors + the refinement
        palette = await paletteApi.extractColorsFromImage(uploadedImage, currentPalette?.colors.length || 5);

        // Then refine with the hint
        palette = await paletteApi.refinePalette({
          original_prompt: `colors from ${uploadedImage.name}`,
          refinement_hint: hint,
          num_colors: currentPalette?.colors.length || 5,
        });
      } else {
        // No image, just text-based refinement
        // Include current palette colors as context for better refinement
        const currentColors = currentPalette?.colors.map(c => c.hex).join(', ') || '';
        palette = await paletteApi.refinePalette({
          original_prompt: `${originalPrompt || currentPalette?.theme || ''} (current colors: ${currentColors})`,
          refinement_hint: hint,
          num_colors: currentPalette?.colors.length || 5,
        });
      }

      setPalette(palette);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to refine palette. Please try again.');
      console.error('Error refining palette:', err);
    } finally {
      setIsRefining(false);
    }
  };



  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden">
      {/* Interactive particle background */}
      <InteractiveBackground />
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Main Content - Full Screen Centered */}
      <div className="relative z-10">
        {/* Header - At top of flow */}
        <header className="py-6 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={clearPalette}
              title="Back to home"
            >
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">VibeColor</h1>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 glass rounded-lg text-sm hover:border-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </header>

        {/* Hero Section - CENTERED VERTICALLY AND HORIZONTALLY */}
        {!currentPalette && (
          <section className="min-h-screen flex items-center justify-center">
            <div className="w-full text-center px-6 sm:px-8 lg:px-12">
              {/* Icon - CENTERED */}
              <div className="flex justify-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-primary pulse-glow">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>

              {/* Heading - CENTERED */}
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text text-center mb-6">
                Color Palettes
                <br />
                <span className="text-foreground">Powered by AI</span>
              </h2>

              {/* Subtitle - CENTERED with max-width */}
              <div className="flex justify-center mb-4">
                <p className="text-xl sm:text-2xl text-foreground-secondary text-center max-w-4xl">
                  Transform your ideas into stunning color palettes using advanced AI semantic analysis
                </p>
              </div>

              {/* Description - CENTERED with max-width */}
              <div className="flex justify-center mb-10">
                <p className="text-sm sm:text-base text-foreground-secondary/80 text-center max-w-2xl leading-relaxed">
                  Just describe your vibe, and let AI create professional, harmonious color schemes with WCAG accessibility compliance
                </p>
              </div>

              {/* Input Component - CENTERED with max-width */}
              <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                  <PaletteInput onGenerate={handleGeneratePalette} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Palette Display - CENTERED */}
        {currentPalette && (
          <section className="py-12">
            <div className="flex justify-center px-4 sm:px-6">
              <div className="w-full max-w-7xl">
                <PaletteDisplay
                  palette={currentPalette}
                  onReset={clearPalette}
                  onRefine={handleRefinePalette}
                  isRefining={isRefining}
                  hasUploadedImage={!!uploadedImage}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Copy Feedback Toast */}
      {showCopyFeedback && (
        <div className="copy-feedback">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
