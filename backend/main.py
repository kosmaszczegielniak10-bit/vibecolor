"""FastAPI backend for VibeColor - AI-powered color palette generator"""
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from models.schemas import GeneratePaletteRequest, AnalyzeColorRequest, RefinePaletteRequest, Palette, ContrastCheck
from services.palette_generator import PaletteGenerator
from services.image_processor import ImageProcessor

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="VibeColor API",
    description="AI-powered color palette generation with semantic analysis",
    version="1.0.0"
)

# Configure CORS - allow Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
palette_generator = PaletteGenerator()
image_processor = ImageProcessor()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "VibeColor API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.post("/api/generate", response_model=Palette)
async def generate_palette(request: GeneratePaletteRequest):
    """
    Generate a color palette from text prompt
    
    The AI analyzes the emotional context and generates harmonious colors
    """
    try:
        palette = palette_generator.generate_palette(
            prompt=request.prompt,
            num_colors=request.num_colors
        )
        return palette
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate palette: {str(e)}")


@app.post("/api/analyze", response_model=ContrastCheck)
async def analyze_contrast(request: AnalyzeColorRequest):
    """
    Analyze WCAG contrast ratio between two colors
    
    Returns contrast ratio and compliance levels
    """
    try:
        result = palette_generator.analyze_contrast(
            foreground=request.foreground,
            background=request.background
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze contrast: {str(e)}")


@app.post("/api/refine", response_model=Palette)
async def refine_palette(request: RefinePaletteRequest):
    """
    Refine an existing palette with additional hints
    
    Combines original prompt with refinement hint for better results
    """
    try:
        # Combine prompts for better context
        combined_prompt = f"{request.original_prompt}, {request.refinement_hint}"
        
        palette = palette_generator.generate_palette(
            prompt=combined_prompt,
            num_colors=request.num_colors
        )
        return palette
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refine palette: {str(e)}")


@app.post("/api/extract-colors", response_model=Palette)
async def extract_colors_from_image(file: UploadFile = File(...), num_colors: int = 5):
    """
    Extract dominant colors from uploaded image
    
    Uses k-means clustering to find the most prominent colors
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate num_colors
        if num_colors < 3 or num_colors > 15:
            raise HTTPException(status_code=400, detail="num_colors must be between 3 and 15")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Extract colors using image processor
        hex_colors = image_processor.extract_colors(image_bytes, num_colors=num_colors)
        
        # Use AI to generate creative names for the extracted colors
        # Create a prompt describing the colors
        color_description = f"colors extracted from an image: {', '.join(hex_colors)}"
        analysis = palette_generator.ai_service.analyze_prompt(color_description)
        
        # Build palette with AI-generated names
        from models.schemas import Color
        colors = []
        color_names = analysis.get('color_names', [f'Color {i+1}' for i in range(len(hex_colors))])
        
        for i, hex_color in enumerate(hex_colors):
            rgb = palette_generator.color_engine.hex_to_rgb(hex_color)
            color_name = color_names[i] if i < len(color_names) else f'Color {i+1}'
            
            colors.append(Color(
                hex=hex_color,
                rgb=rgb,
                name=color_name
            ))
        
        # Calculate contrast info
        contrast_info = []
        for i in range(len(colors) - 1):
            ratio = palette_generator.color_engine.calculate_contrast_ratio(
                colors[i].hex,
                colors[i + 1].hex
            )
            wcag = palette_generator.color_engine.get_wcag_compliance(ratio)
            
            from models.schemas import ContrastCheck
            contrast_info.append(ContrastCheck(
                ratio=wcag['ratio'],
                aa_normal=wcag['aa_normal'],
                aa_large=wcag['aa_large'],
                aaa_normal=wcag['aaa_normal'],
                aaa_large=wcag['aaa_large']
            ))
        
        return Palette(
            colors=colors,
            theme=f"Extracted from {file.filename}",
            mood=analysis.get('mood', 'extracted from image'),
            contrast_info=contrast_info
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze contrast: {str(e)}")


@app.get("/health")
async def health_check():
    """Detailed health check"""
    groq_configured = bool(os.getenv('GROQ_API_KEY'))
    openai_configured = bool(os.getenv('OPENAI_API_KEY'))
    
    ai_provider = 'groq' if groq_configured else ('openai' if openai_configured else 'fallback')
    
    return {
        "status": "healthy",
        "ai_enabled": groq_configured or openai_configured,
        "ai_provider": ai_provider,
        "features": {
            "palette_generation": True,
            "contrast_analysis": True,
            "wcag_compliance": True
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
