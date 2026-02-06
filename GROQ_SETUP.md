 # 🆓 Jak dodać DARMOWY Groq AI do VibeColor

## Krok 1: Zdobądź DARMOWY klucz Groq

1. **Wejdź na:** https://console.groq.com/
2. **Zaloguj się** (możesz użyć Google/GitHub)
3. **Kliknij "API Keys"** w menu po lewej
4. **"Create API Key"** → Nazwij go "VibeColor"
5. **Skopiuj klucz** (zaczyna się od `gsk_...`)

⏱️ **Zajmuje to 2 minuty!**

---

## Krok 2: Dodaj klucz do aplikacji

### **Metoda 1: Plik .env (łatwa)**

```bash
cd /Users/kosma/Desktop/Antigravity/ColorPallete/backend

# Stwórz plik .env
nano .env
```

**Wklej tę linijkę (zamień klucz na swój):**
```
GROQ_API_KEY=gsk_twoj_klucz_tutaj
```

**Zapisz:**
- Naciśnij: `Ctrl + O`
- Enter
- `Ctrl + X`

---

### **Metoda 2: Jedna komenda (szybsza)**

```bash
cd /Users/kosma/Desktop/Antigravity/ColorPallete/backend

echo "GROQ_API_KEY=gsk_twoj_klucz_tutaj" > .env
```

⚠️ **Zamień `gsk_twoj_klucz_tutaj` na rzeczywisty klucz!**

---

## Krok 3: Zainstaluj nową bibliotekę

```bash
cd /Users/kosma/Desktop/Antigravity/ColorPallete/backend

# Aktywuj środowisko
source venv/bin/activate

# Zainstaluj groq
pip install groq==0.11.0
```

---

## Krok 4: Restart backendu

**W terminalu gdzie działa backend:**

1. **Zatrzymaj:** `Ctrl + C`
2. **Uruchom ponownie:** `python main.py`

**Zobaczysz:**
```
✅ Using Groq AI (FREE, fast)
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## ✅ Gotowe!

Teraz każde wyszukiwanie generuje **UNIKALNE palety** używając darmowego AI! 🎨

---

## 🎯 Sprawdź czy działa:

1. Wejdź na: http://localhost:3001
2. Wpisz: **"futuristic cyberpunk city at night"**
3. Kliknij "Generate Palette"
4. Spróbuj ponownie z tym samym tekstem → **Dostaniesz INNĄ paletę!**

---

## 🆚 Co się zmieniło?

**BEZ Groq:**
- "sunset" → zawsze te same kolory
- Szybko ale monotonnie

**Z Groq:**
- "futuristic sunset over neon city" → różne kombinacje za każdym razem
- Bardziej kreatywne nazwy kolorów
- Lepsze zrozumienie kontekstu
- **NADAL ZA DARMO!** 🎉

---

## ❓ Problemy?

### Backend nie startuje
```bash
# Zainstaluj ponownie zależności
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Nadal fallback mode?
- Sprawdź czy klucz zaczyna się od `gsk_`
- Sprawdź czy plik `.env` jest w folderze `/backend`
- Sprawdź czy zrestartowałeś backend

### Limit exceeded?
Groq ma limity (Rate Limits):
- 30 requests/minute (wystarczy!)
- Jeśli przekroczysz, poczekaj minutę

---

**Powodzenia!** 🚀
