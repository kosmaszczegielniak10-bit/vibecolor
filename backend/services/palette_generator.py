"""Main palette generation service combining AI and color theory"""
from typing import List
from models.schemas import Color, Palette, ContrastCheck
from services.ai_service import AIService
from services.color_engine import ColorEngine


class PaletteGenerator:
    """Generates color palettes using AI analysis and color theory"""
    
    def __init__(self):
        self.ai_service = AIService()
        self.color_engine = ColorEngine()
    
    def generate_palette(self, prompt: str, num_colors: int = 5) -> Palette:
        """Generate a complete color palette from text prompt"""
        
        # Step 1: AI semantic analysis
        analysis = self.ai_service.analyze_prompt(prompt)
        
        # Step 2: Generate harmonious colors based on AI suggestion
        base_color = analysis.get('base_color', '#6366F1')
        hex_colors = self.color_engine.generate_harmony_colors(base_color, num_colors)
        
        # Step 3: Create Color objects with names
        color_names = analysis.get('color_names', [f'Color {i+1}' for i in range(num_colors)])
        colors = []
        
        for i, hex_color in enumerate(hex_colors):
            rgb = self.color_engine.hex_to_rgb(hex_color)
            color_name = color_names[i] if i < len(color_names) else f'Color {i+1}'
            
            colors.append(Color(
                hex=hex_color,
                rgb=rgb,
                name=color_name
            ))
        
        # Step 4: Calculate contrast information (between adjacent colors)
        contrast_info = []
        for i in range(len(colors) - 1):
            ratio = self.color_engine.calculate_contrast_ratio(
                colors[i].hex,
                colors[i + 1].hex
            )
            wcag = self.color_engine.get_wcag_compliance(ratio)
            
            contrast_info.append(ContrastCheck(
                ratio=wcag['ratio'],
                aa_normal=wcag['aa_normal'],
                aa_large=wcag['aa_large'],
                aaa_normal=wcag['aaa_normal'],
                aaa_large=wcag['aaa_large']
            ))
        
        # Step 5: Create and return palette
        return Palette(
            colors=colors,
            theme=prompt,
            mood=analysis.get('mood', 'harmonious'),
            contrast_info=contrast_info
        )
    
    def analyze_contrast(self, foreground: str, background: str) -> ContrastCheck:
        """Analyze contrast between two colors"""
        ratio = self.color_engine.calculate_contrast_ratio(foreground, background)
        wcag = self.color_engine.get_wcag_compliance(ratio)
        
        return ContrastCheck(
            ratio=wcag['ratio'],
            aa_normal=wcag['aa_normal'],
            aa_large=wcag['aa_large'],
            aaa_normal=wcag['aaa_normal'],
            aaa_large=wcag['aaa_large']
        )
