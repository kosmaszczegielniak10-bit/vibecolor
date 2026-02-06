import axios from 'axios';
import { Palette } from '@/store/paletteStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface GeneratePaletteRequest {
    prompt: string;
    num_colors?: number;
}

export interface AnalyzeColorRequest {
    foreground: string;
    background: string;
}

export interface RefinePaletteRequest {
    original_prompt: string;
    refinement_hint: string;
    num_colors?: number;
}

export const paletteApi = {
    generatePalette: async (request: GeneratePaletteRequest): Promise<Palette> => {
        const response = await api.post<Palette>('/generate', {
            prompt: request.prompt,
            num_colors: request.num_colors || 5,
        });
        return response.data;
    },

    refinePalette: async (request: RefinePaletteRequest): Promise<Palette> => {
        const response = await api.post<Palette>('/refine', {
            original_prompt: request.original_prompt,
            refinement_hint: request.refinement_hint,
            num_colors: request.num_colors || 5,
        });
        return response.data;
    },

    extractColorsFromImage: async (file: File, numColors: number = 5): Promise<Palette> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<Palette>(`/extract-colors?num_colors=${numColors}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    analyzeContrast: async (request: AnalyzeColorRequest) => {
        const response = await api.post('/analyze', request);
        return response.data;
    },

    healthCheck: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};
