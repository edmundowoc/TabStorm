# Playwright Traffic Tester

Narzędzie do testowania wejść na stronę z użyciem prawdziwej przeglądarki (Playwright). Wejścia są rejestrowane w Google Analytics, Matomo, Cloudflare i innych narzędziach analitycznych.

## ⚠️ Wymagania bezpieczeństwa

**Używaj tego narzędzia TYLKO na stronach, których jesteś właścicielem!**

Aplikacja wymaga potwierdzenia, że testujesz własną stronę. Każde inne użycie jest nielegalne i nieetyczne.

## 🚀 Instalacja i uruchomienie

### 1. Backend (FastAPI + Playwright)

```bash
# Zainstaluj zależności Python
pip install -r requirements.txt

# Zainstaluj przeglądarki Playwright
playwright install

# Uruchom serwer FastAPI
uvicorn main:app --reload
```

Backend będzie dostępny pod adresem: `http://localhost:8000`

API dokumentacja: `http://localhost:8000/docs`

### 2. Frontend (React)

Frontend jest uruchomiony automatycznie w środowisku Lovable.

Jeśli chcesz uruchomić lokalnie:

```bash
npm install
npm run dev
```

## 📋 Jak to działa?

1. **Frontend** - formularz konfiguracji testu (URL, liczba otwarć, proxy)
2. **Checkbox bezpieczeństwa** - wymagane potwierdzenie właściciela strony
3. **Backend FastAPI** - przyjmuje żądanie i uruchamia Playwright
4. **Playwright** - otwiera prawdziwą przeglądarkę (headless=False):
   - Ładuje stronę z pełnym oczekiwaniem na zasoby (networkidle)
   - Wykonuje płynne scrollowanie (300px co 200ms)
   - Czeka 3 sekundy na rejestrację w analityce
5. **Równoległe wykonanie** - wszystkie wizyty są uruchamiane jednocześnie
6. **Wyniki** - liczba sukcesów, błędów, czas wykonania

## 🔒 Funkcje bezpieczeństwa

- ✅ Obowiązkowy checkbox potwierdzenia właściciela
- ✅ Backend odmawia wykonania bez potwierdzenia
- ✅ Limit maksymalny: 100 otwarć na test
- ✅ Walidacja URL

## 🌐 Wsparcie proxy

Obsługiwane typy proxy:
- HTTP
- SOCKS5

Opcjonalne uwierzytelnienie (username/password).

## 🎯 Przypadki użycia

- Testowanie rejestracji wydarzeń w Google Analytics
- Weryfikacja konfiguracji Matomo
- Sprawdzanie statystyk Cloudflare
- Testowanie heat map i session recording
- QA przed produkcją

## 📊 API Endpoint

```
POST /run
```

**Request body:**
```json
{
  "url": "https://example.com",
  "count": 10,
  "proxy_type": "http",
  "proxy_host": "proxy.example.com",
  "proxy_port": "8080",
  "proxy_username": "user",
  "proxy_password": "pass",
  "owner_confirmed": true
}
```

**Response:**
```json
{
  "success_count": 10,
  "error_count": 0,
  "proxy_used": true,
  "execution_time": 45.23
}
```

## 🛠️ Stack technologiczny

### Backend
- **FastAPI** - szybki framework webowy
- **Playwright** - automatyzacja przeglądarki
- **Python 3.8+** - język programowania

### Frontend
- **React** - biblioteka UI
- **TypeScript** - typowany JavaScript
- **Tailwind CSS** - utility-first CSS
- **shadcn/ui** - komponenty UI

## ⚖️ Uwagi prawne

To narzędzie jest przeznaczone WYŁĄCZNIE do testowania własnych stron. Użycie na stronach trzecich bez zgody właściciela jest nielegalne.

## 📝 Licencja

MIT

## 🤝 Wkład

Pull requesty mile widziane! Dla większych zmian, otwórz najpierw issue.

---

Stworzone z ❤️ przy użyciu [Lovable](https://lovable.dev)
