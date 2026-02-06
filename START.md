# 🚀 INSTRUKCJA URUCHOMIENIA VIBECOLOR

## ⚠️ ZANIM ZACZNIESZ - Zatrzymaj wszystko

Skopiuj i wklej te komendy do terminala:

```bash
# Zatrzymaj wszystkie stare procesy
pkill -f "next dev"
pkill -f "python main.py"
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
```

Poczekaj 2 sekundy.

---

## 📋 KROK PO KROKU

### KROK 1: Otwórz DWA terminale

- **Terminal 1** → będzie dla backendu
- **Terminal 2** → będzie dla frontendu

---

### KROK 2: Uruchom Backend (Terminal 1)

Skopiuj i wklej te komendy **PO KOLEI**:

```bash
# 1. Przejdź do folderu backend
cd /Users/kosma/Desktop/Antigravity/ColorPallete/backend

# 2. Aktywuj środowisko Python
source venv/bin/activate

# 3. Uruchom backend
python main.py
```

**POCZEKAJ** aż zobaczysz:
```
✅ Using Groq AI (FREE, fast)
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**NIE ZAMYKAJ** tego terminala! Pozostaw go otwartego.

---

### KROK 3: Uruchom Frontend (Terminal 2)

W **drugim terminalu**, skopiuj i wklej te komendy **PO KOLEI**:

```bash
# 1. Przejdź do folderu frontend
cd /Users/kosma/Desktop/Antigravity/ColorPallete/frontend

# 2. Usuń stary lock file (jeśli istnieje)
rm -f .next/dev/lock

# 3. Uruchom frontend
npm run dev
```

**POCZEKAJ** aż zobaczysz:
```
▲ Next.js 16.1.6
- Local:    http://localhost:3000
✓ Ready in ...ms
```

**NIE ZAMYKAJ** tego terminala! Pozostaw go otwartego.

---

### KROK 4: Otwórz w przeglądarce

Otwórz przeglądarkę i wejdź na:

```
http://localhost:3000
```

Powinieneś zobaczyć aplikację VibeColor! 🎨

---

## ✅ Sprawdź czy działa

Wpisz w pole tekstowe:
```
sunset over ocean
```

Kliknij **"Generate Palette"**

Powinieneś zobaczyć 5 pięknych kolorów z kreatywnymi nazwami! 🌅

---

## 🛑 Jak zatrzymać

Kiedy skończysz:

1. W terminalu z backendem: `Ctrl + C`
2. W terminalu z frontendem: `Ctrl + C`

Albo zamknij oba terminale.

---

## 🆘 Jeśli coś nie działa

### Backend nie startuje?

```bash
cd /Users/kosma/Desktop/Antigravity/ColorPallete/backend
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend pokazuje błąd?

```bash
cd /Users/kosma/Desktop/Antigravity/ColorPallete/frontend
rm -rf .next
rm -f .next/dev/lock
npm install
npm run dev
```

### Port zajęty?

```bash
# Znajdź i zabij proces
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

Potem spróbuj ponownie od KROKU 2.

---

## 📞 Potrzebujesz pomocy?

Jeśli nadal nie działa, napisz mi:
- Co dokładnie widzisz w terminalu?
- Jaki błąd pokazuje przeglądarka?
- Na którym kroku się zatrzymałeś?
