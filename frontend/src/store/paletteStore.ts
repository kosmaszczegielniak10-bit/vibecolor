import { create } from 'zustand';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  name?: string;
}

export interface ContrastCheck {
  ratio: number;
  aa_normal: boolean;
  aa_large: boolean;
  aaa_normal: boolean;
  aaa_large: boolean;
}

export interface Palette {
  colors: Color[];
  theme: string;
  mood?: string;
  contrast_info?: ContrastCheck[];
}

interface PaletteStore {
  currentPalette: Palette | null;
  isLoading: boolean;
  error: string | null;
  
  setPalette: (palette: Palette) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPalette: () => void;
}

export const usePaletteStore = create<PaletteStore>((set) => ({
  currentPalette: null,
  isLoading: false,
  error: null,
  
  setPalette: (palette) => set({ currentPalette: palette, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearPalette: () => set({ currentPalette: null, error: null }),
}));
