"""AI service for semantic analysis of text to extract color emotions and themes"""
import os
from typing import Optional
from openai import OpenAI
from groq import Groq


class AIService:
    """Handles LLM-based semantic analysis for color generation"""
    
    def __init__(self):
        # Try Groq first (free and fast!)
        groq_key = os.getenv('GROQ_API_KEY')
        openai_key = os.getenv('OPENAI_API_KEY')
        
        if groq_key:
            print("✅ Using Groq AI (FREE, fast)")
            self.client = Groq(api_key=groq_key)
            self.provider = 'groq'
        elif openai_key:
            print("✅ Using OpenAI GPT")
            self.client = OpenAI(api_key=openai_key)
            self.provider = 'openai'
        else:
            print("⚠️ No API key found. Using fallback mode (keyword-based).")
            self.client = None
            self.provider = None
    
    def analyze_prompt(self, prompt: str) -> dict:
        """
        Analyze user prompt to extract emotional context and color preferences
        Returns: {'mood': str, 'base_color': str, 'color_names': list}
        """
        if not self.client:
            return self._fallback_analysis(prompt)
        
        try:
            # System prompt for AI
            system_prompt = """You are a color theory expert and designer. When given a text prompt, 
            analyze its emotional tone and suggest appropriate colors. Respond in JSON format with:
            {
                "mood": "brief mood description",
                "base_color": "hex color code that captures the essence",
                "color_names": ["name1", "name2", "name3", "name4", "name5"]
            }
            
            The color_names should be creative, evocative names for each color in the palette.
            Base your suggestions on:
            - Emotional tone (warm, cool, energetic, calm)
            - Cultural associations (sunset = orange/pink, ocean = blue/teal)
            - Time of day or season if mentioned
            - Professional context (corporate = blue/grey, creative = vibrant)
            """
            
            # Choose model based on provider
            if self.provider == 'groq':
                model = "llama-3.3-70b-versatile"  # Updated model (llama-3.1 was decommissioned)
            else:  # openai
                model = "gpt-3.5-turbo"
            
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Generate a color palette for: {prompt}"}
                ],
                response_format={"type": "json_object"} if self.provider == 'groq' else {"type": "json_object"},
                temperature=0.7,
                max_tokens=300
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"❌ AI analysis error: {e}")
            print("📌 Falling back to keyword mode...")
            return self._fallback_analysis(prompt)
    
    def _fallback_analysis(self, prompt: str) -> dict:
        """Fallback analysis when AI is not available"""
        prompt_lower = prompt.lower()
        
        # Simple keyword-based color selection
        color_map = {
            'sunset': {'mood': 'warm and romantic', 'base_color': '#FF6B6B', 'color_names': ['Sunset Coral', 'Golden Hour', 'Dusk Rose', 'Amber Glow', 'Twilight Purple']},
            'ocean': {'mood': 'calm and serene', 'base_color': '#4ECDC4', 'color_names': ['Ocean Teal', 'Deep Sea', 'Wave Blue', 'Seafoam', 'Coral Reef']},
            'forest': {'mood': 'natural and grounding', 'base_color': '#2D6A4F', 'color_names': ['Forest Green', 'Moss', 'Pine', 'Fern', 'Sage']},
            'corporate': {'mood': 'professional and trustworthy', 'base_color': '#2C3E50', 'color_names': ['Navy Blue', 'Slate Grey', 'Steel', 'Charcoal', 'Silver']},
            'vintage': {'mood': 'nostalgic and warm', 'base_color': '#D4A574', 'color_names': ['Vintage Gold', 'Sepia', 'Antique Brass', 'Faded Rose', 'Parchment']},
            'neon': {'mood': 'energetic and bold', 'base_color': '#FF006E', 'color_names': ['Electric Pink', 'Neon Green', 'Cyber Blue', 'Volt Yellow', 'Hot Magenta']},
            'pastel': {'mood': 'soft and gentle', 'base_color': '#B4A7D6', 'color_names': ['Lavender', 'Mint', 'Peach', 'Baby Blue', 'Soft Pink']},
            'cyberpunk': {'mood': 'futuristic and electric', 'base_color': '#FF00FF', 'color_names': ['Neon Magenta', 'Cyber Blue', 'Electric Green', 'Hot Pink', 'Digital Purple']},
            'spring': {'mood': 'fresh and vibrant', 'base_color': '#90EE90', 'color_names': ['Spring Green', 'Blossom Pink', 'Sky Blue', 'Sunshine Yellow', 'Fresh Mint']},
            'autumn': {'mood': 'cozy and warm', 'base_color': '#D2691E', 'color_names': ['Autumn Orange', 'Maple Red', 'Golden Brown', 'Rust', 'Harvest Gold']},
        }
        
        for keyword, colors in color_map.items():
            if keyword in prompt_lower:
                return colors
        
        # Default fallback
        return {
            'mood': 'balanced and harmonious',
            'base_color': '#6366F1',
            'color_names': ['Primary', 'Secondary', 'Accent', 'Highlight', 'Shadow']
        }
