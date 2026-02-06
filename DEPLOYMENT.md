# VibeColor Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 18+** and npm (for frontend)
- **Git** (for cloning)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ColorPallete
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python main.py
```

Backend runs on **http://localhost:8000**
API docs available at **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on **http://localhost:3001**

---

## Deployment Options

### Option 1: Vercel (Recommended - FREE)

**Best for:** Quick deployment with zero configuration

#### Frontend Deployment

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Set root directory to `frontend`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL` = your backend URL (see below)
   - Click "Deploy"

#### Backend Deployment (Railway or Render)

**Option A: Railway**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables (if using OpenAI):
   - `OPENAI_API_KEY` = your OpenAI key
7. Railway will auto-detect Python and deploy
8. Copy the generated URL

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (if using OpenAI):
   - `OPENAI_API_KEY` = your OpenAI key
6. Click "Create Web Service"
7. Copy the generated URL

3. **Update Frontend Environment**
   - In Vercel, go to your project settings
   - Update `NEXT_PUBLIC_API_URL` with your backend URL
   - Redeploy frontend

---

### Option 2: Docker Deployment

**Best for:** Self-hosting with full control

#### Using Docker Compose

```bash
# Create .env file in root directory
cp .env.example .env

# Edit .env and add your API key (optional)
# OPENAI_API_KEY=your_key_here

# Build and run
docker-compose up --build

# Access:
# Frontend: http://localhost:3001
# Backend: http://localhost:8000
```

#### Deploy to a VPS (DigitalOcean, Linode, etc.)

```bash
# On your server
git clone <your-repo>
cd ColorPallete

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Run application
docker-compose up -d

# Set up reverse proxy (nginx) for domain
```

---

### Option 3: Static Export (Limited)

**Note:** This only works WITHOUT the backend API. The app will use fallback mode only.

```bash
cd frontend

# Build static site
npm run build
npm run export

# Deploy `out` folder to:
# - GitHub Pages
# - Netlify
# - Any static hosting
```

**Limitations:**
- No OpenAI API integration
- Only keyword-based palette generation
- No dynamic AI mood detection

---

## Environment Variables

### Backend (.env)
```bash
# Optional - for full AI features
OPENAI_API_KEY=sk-...

# Server config (optional)
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)
```bash
# Required - URL to backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## Production Checklist

- [ ] Push code to GitHub repository
- [ ] Deploy backend to Railway/Render
- [ ] Get backend URL
- [ ] Deploy frontend to Vercel
- [ ] Set `NEXT_PUBLIC_API_URL` in Vercel
- [ ] Test palette generation
- [ ] (Optional) Add custom domain
- [ ] (Optional) Add OpenAI API key for AI features

---

## Custom Domain Setup

### Vercel (Frontend)
1. Go to project settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Railway/Render (Backend)
1. Go to project settings
2. Add custom domain
3. Update DNS CNAME record

---

## Troubleshooting

### CORS Errors
Make sure your frontend URL is in the backend CORS allowed origins:
```python
# backend/main.py
origins = [
    "http://localhost:3001",
    "https://your-frontend.vercel.app",
]
```

### API Connection Failed
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is running and accessible
- Check browser console for errors

### OpenAI API Not Working
- Verify API key is correct in backend environment
- Check OpenAI account has credits
- App will automatically use fallback mode if API fails

---

## Cost Estimate

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | **FREE** | Generous free tier |
| Railway (Backend) | **$5/month** | After free trial |
| Render (Backend) | **FREE** | With limitations |
| OpenAI API | **~$0.002/request** | Optional, keyword fallback available |
| Custom Domain | **$10-15/year** | Optional |

**Total:** Can run completely **FREE** using Vercel (free) + Render (free) without OpenAI API

---

## Recommended Setup for Production

```
flowchart LR
    A[User] --> B[Vercel<br/>Frontend]
    B --> C[Railway/Render<br/>Backend API]
    C --> D[OpenAI API<br/>Optional]
    
    style B fill:#6366f1
    style C fill:#10b981
    style D fill:#f59e0b
```

1. **Frontend**: Vercel (free, automatic CI/CD, CDN)
2. **Backend**: Railway ($5/mo) or Render (free tier)
3. **AI**: OpenAI API (pay-per-use) or use keyword fallback

---

## Support

For issues or questions:
- Check backend logs: `docker-compose logs backend`
- Check frontend logs in Vercel dashboard
- API documentation: `http://your-backend-url/docs`
