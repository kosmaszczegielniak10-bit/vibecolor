from pydantic import BaseModel, Field
from typing import List, Optional


class Color(BaseModel):
    """Represents a single color with multiple format representations"""
    hex: str = Field(..., description="Hex color code (e.g., #FF5733)")
    rgb: dict = Field(..., description="RGB values {r, g, b}")
    name: Optional[str] = Field(None, description="AI-generated color name")
    
    
class ContrastCheck(BaseModel):
    """WCAG contrast ratio information"""
    ratio: float
    aa_normal: bool  # WCAG AA for normal text (4.5:1)
    aa_large: bool   # WCAG AA for large text (3:1)
    aaa_normal: bool # WCAG AAA for normal text (7:1)
    aaa_large: bool  # WCAG AAA for large text (4.5:1)


class Palette(BaseModel):
    """Generated color palette"""
    colors: List[Color]
    theme: str = Field(..., description="Original user prompt/theme")
    mood: Optional[str] = Field(None, description="Detected mood from AI")
    contrast_info: Optional[List[ContrastCheck]] = Field(None, description="Contrast between colors")


class GeneratePaletteRequest(BaseModel):
    """Request to generate a color palette"""
    prompt: str = Field(..., min_length=1, max_length=500, description="Text description of desired palette")
    num_colors: int = Field(5, ge=3, le=15, description="Number of colors to generate")


class AnalyzeColorRequest(BaseModel):
    """Request to analyze color accessibility"""
    foreground: str = Field(..., description="Foreground color hex code")
    background: str = Field(..., description="Background color hex code")


class RefinePaletteRequest(BaseModel):
    """Request to refine an existing palette with additional hints"""
    original_prompt: str = Field(..., min_length=1, max_length=500, description="Original palette prompt")
    refinement_hint: str = Field(..., min_length=1, max_length=500, description="Additional refinement hint")
    num_colors: int = Field(5, ge=3, le=15, description="Number of colors to generate")

