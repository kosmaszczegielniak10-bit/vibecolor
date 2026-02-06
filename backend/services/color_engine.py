"""Color mathematics engine for conversions, contrast, and WCAG compliance"""
import colorsys
import re
from typing import Tuple, Dict
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color


class ColorEngine:
    """Handles all color mathematics operations"""
    
    @staticmethod
    def hex_to_rgb(hex_color: str) -> Dict[str, int]:
        """Convert hex color to RGB dictionary"""
        hex_color = hex_color.lstrip('#')
        return {
            'r': int(hex_color[0:2], 16),
            'g': int(hex_color[2:4], 16),
            'b': int(hex_color[4:6], 16)
        }
    
    @staticmethod
    def rgb_to_hex(r: int, g: int, b: int) -> str:
        """Convert RGB values to hex string"""
        return f"#{r:02x}{g:02x}{b:02x}".upper()
    
    @staticmethod
    def rgb_to_lab(r: int, g: int, b: int) -> Tuple[float, float, float]:
        """Convert RGB to LAB color space"""
        rgb = sRGBColor(r / 255.0, g / 255.0, b / 255.0)
        lab = convert_color(rgb, LabColor)
        return (lab.lab_l, lab.lab_a, lab.lab_b)
    
    @staticmethod
    def calculate_relative_luminance(r: int, g: int, b: int) -> float:
        """Calculate relative luminance for WCAG contrast calculations"""
        def adjust(channel):
            c = channel / 255.0
            if c <= 0.03928:
                return c / 12.92
            return ((c + 0.055) / 1.055) ** 2.4
        
        r_adj = adjust(r)
        g_adj = adjust(g)
        b_adj = adjust(b)
        
        return 0.2126 * r_adj + 0.7152 * g_adj + 0.0722 * b_adj
    
    @staticmethod
    def calculate_contrast_ratio(hex1: str, hex2: str) -> float:
        """Calculate WCAG contrast ratio between two colors"""
        rgb1 = ColorEngine.hex_to_rgb(hex1)
        rgb2 = ColorEngine.hex_to_rgb(hex2)
        
        l1 = ColorEngine.calculate_relative_luminance(rgb1['r'], rgb1['g'], rgb1['b'])
        l2 = ColorEngine.calculate_relative_luminance(rgb2['r'], rgb2['g'], rgb2['b'])
        
        lighter = max(l1, l2)
        darker = min(l1, l2)
        
        return (lighter + 0.05) / (darker + 0.05)
    
    @staticmethod
    def get_wcag_compliance(contrast_ratio: float) -> Dict[str, bool]:
        """Check WCAG compliance levels"""
        return {
            'aa_normal': contrast_ratio >= 4.5,
            'aa_large': contrast_ratio >= 3.0,
            'aaa_normal': contrast_ratio >= 7.0,
            'aaa_large': contrast_ratio >= 4.5,
            'ratio': round(contrast_ratio, 2)
        }
    
    @staticmethod
    def adjust_brightness(hex_color: str, factor: float) -> str:
        """Adjust brightness of a color (factor: -1 to 1)"""
        rgb = ColorEngine.hex_to_rgb(hex_color)
        h, l, s = colorsys.rgb_to_hls(rgb['r']/255, rgb['g']/255, rgb['b']/255)
        
        # Adjust lightness
        l = max(0, min(1, l + factor * 0.3))
        
        r, g, b = colorsys.hls_to_rgb(h, l, s)
        return ColorEngine.rgb_to_hex(int(r * 255), int(g * 255), int(b * 255))
    
    @staticmethod
    def generate_harmony_colors(base_hex: str, num_colors: int = 5) -> list[str]:
        """Generate harmonious colors based on a base color using color theory"""
        rgb = ColorEngine.hex_to_rgb(base_hex)
        h, l, s = colorsys.rgb_to_hls(rgb['r']/255, rgb['g']/255, rgb['b']/255)
        
        colors = [base_hex]
        seen_colors = {base_hex.upper()}
        
        def is_unique(new_hex):
            """Check if color is visually different from existing colors"""
            new_hex_upper = new_hex.upper()
            if new_hex_upper in seen_colors:
                return False
            
            new_rgb = ColorEngine.hex_to_rgb(new_hex)
            for existing_hex in colors:
                existing_rgb = ColorEngine.hex_to_rgb(existing_hex)
                # Calculate simple RGB distance
                distance = ((new_rgb['r'] - existing_rgb['r']) ** 2 +
                           (new_rgb['g'] - existing_rgb['g']) ** 2 +
                           (new_rgb['b'] - existing_rgb['b']) ** 2) ** 0.5
                # Reject if too similar (threshold 40 - moderate)
                if distance < 40:
                    return False
            return True
        
        # Generate complementary and analogous colors with deduplication
        if num_colors >= 2:
            # Complementary (opposite on color wheel)
            comp_h = (h + 0.5) % 1.0
            r, g, b = colorsys.hls_to_rgb(comp_h, l, s)
            comp_hex = ColorEngine.rgb_to_hex(int(r*255), int(g*255), int(b*255))
            if is_unique(comp_hex):
                colors.append(comp_hex)
                seen_colors.add(comp_hex.upper())
        
        if num_colors >= 3:
            # Triadic (120 degrees)
            tri_h = (h + 1/3) % 1.0
            r, g, b = colorsys.hls_to_rgb(tri_h, l, s)
            tri_hex = ColorEngine.rgb_to_hex(int(r*255), int(g*255), int(b*255))
            if is_unique(tri_hex):
                colors.append(tri_hex)
                seen_colors.add(tri_hex.upper())
        
        if num_colors >= 4:
            # Split complementary
            split_h = (h + 0.417) % 1.0  # 150 degrees
            r, g, b = colorsys.hls_to_rgb(split_h, l, s)
            split_hex = ColorEngine.rgb_to_hex(int(r*255), int(g*255), int(b*255))
            if is_unique(split_hex):
                colors.append(split_hex)
                seen_colors.add(split_hex.upper())
        
        if num_colors >= 5:
            # Darker shade
            darker_l = max(0.1, l - 0.25)
            r, g, b = colorsys.hls_to_rgb(h, darker_l, s)
            darker_hex = ColorEngine.rgb_to_hex(int(r*255), int(g*255), int(b*255))
            if is_unique(darker_hex):
                colors.append(darker_hex)
                seen_colors.add(darker_hex.upper())
        
        # Fill remaining with varied hues and lightness
        attempt = 0
        max_attempts = num_colors * 20
        while len(colors) < num_colors and attempt < max_attempts:
            attempt += 1
            # Vary both hue and lightness
            hue_shift = (attempt * 0.12) % 1.0  # Larger shifts
            light_shift = 0.3 if attempt % 2 == 0 else -0.3
            variant_h = (h + hue_shift) % 1.0
            variant_l = max(0.1, min(0.9, l + light_shift))
            r, g, b = colorsys.hls_to_rgb(variant_h, variant_l, s)
            variant_hex = ColorEngine.rgb_to_hex(int(r*255), int(g*255), int(b*255))
            if is_unique(variant_hex):
                colors.append(variant_hex)
                seen_colors.add(variant_hex.upper())
        
        # Fallback: if still not enough, generate very different colors
        while len(colors) < num_colors:
            idx = len(colors)
            fallback_h = (h + (idx * 0.2)) % 1.0
            fallback_l = 0.5 + ((idx % 3) - 1) * 0.2
            r, g, b = colorsys.hls_to_rgb(fallback_h, fallback_l, max(0.5, s))
            colors.append(ColorEngine.rgb_to_hex(int(r*255), int(g*255), int(b*255)))
        
        return colors[:num_colors]
