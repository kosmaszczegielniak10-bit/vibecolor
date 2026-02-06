# VibeColor - AI-Powered Color Palette Generator

**Transform your ideas into stunning color palettes using advanced AI semantic analysis.**

![VibeColor](https://img.shields.io/badge/AI-Powered-6366f1) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-10b981) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## ✨ Features

- 🎨 **AI-Powered Generation**: Uses OpenAI GPT to analyze emotional context and generate harmonious color palettes
- 🎯 **Color Theory**: Implements professional color harmony algorithms (complementary, triadic, analogous)
- ♿ **WCAG Compliance**: Automatic contrast ratio calculation with AA/AAA accessibility checks
- 🎭 **Premium UI**: Glassmorphism design with smooth animations and micro-interactions
- 📤 **Export Options**: Download palettes as CSS variables or JSON
- 🌈 **Flexible**: Generate 3-10 colors per palette
- ⚡ **Fast**: Real-time generation with optimized backend

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Lucide React** for icons

### Backend
- **FastAPI** (Python 3.11+)
- **OpenAI API** for semantic analysis
- **ColorMath** for color space conversions
- **Pydantic** for data validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- OpenAI API key (optional - works without it using fallback mode)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ColorPallete
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional)
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env.local file
cp .env.local.example .env.local
```

4. **Run the Application**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
# Backend will run on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

5. **Open your browser**
```
http://localhost:3000
```

## 🐳 Docker Setup (Alternative)

```bash
# Set your OpenAI API key in .env file
echo "OPENAI_API_KEY=your_key_here" > .env

# Run with Docker Compose
docker-compose up

# Access the application at http://localhost:3000
```

## 📖 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Main Endpoints

**Generate Palette**
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "sunset over ocean",
  "num_colors": 5
}
```

**Analyze Contrast**
```http
POST /api/analyze
Content-Type: application/json

{
  "foreground": "#FF5733",
  "background": "#FFFFFF"
}
```

## 🎨 Usage Examples

### Text Prompts That Work Well:
- `"sunset over the ocean"`
- `"corporate professional"`
- `"vintage jazz club"`
- `"cyberpunk neon city"`
- `"cozy coffee shop"`
- `"spring garden"`
- `"minimalist scandinavian"`

### Features:
1. **Generate Palette**: Enter a descriptive prompt and click "Generate Palette"
2. **Copy Colors**: Click any color card to copy its hex code
3. **View Accessibility**: See WCAG compliance information between adjacent colors
4. **Export**: Download palette as CSS variables or JSON

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
ColorPallete/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── services/
│   │   ├── ai_service.py    # OpenAI integration
│   │   ├── color_engine.py  # Color mathematics
│   │   └── palette_generator.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── store/         # Zustand state management
│   └── package.json
└── docker-compose.yml
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Build
```bash
cd frontend
npm run build
npm run lint
```

## 🎯 Roadmap

- [ ] 3D visualization with React Three Fiber
- [ ] Palette history and favorites
- [ ] User accounts and saved palettes
- [ ] Vector database for improved AI suggestions
- [ ] Color blindness simulation
- [ ] Gradient generation
- [ ] Image-to-palette extraction

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Next.js team for the amazing framework
- FastAPI for the high-performance backend framework
- Color theory resources from Adobe Color and Coolors

---

**Built with ❤️ using Next.js, FastAPI, and AI**
