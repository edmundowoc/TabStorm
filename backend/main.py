from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, HttpUrl
from playwright.async_api import async_playwright
import asyncio
from typing import Optional
import time

# -------------------------------
#   FASTAPI — APLIKACJA
# -------------------------------
app = FastAPI(title="Playwright Traffic Tester")

# -------------------------------
#   CORS — musi być przed ROUTERAMI
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # pozwól frontendowi działać z dowolnego źródła
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
#   FRONTEND STATIC — musi być PRZED endpointami API
# -------------------------------
app.mount("/", StaticFiles(directory="static", html=True), name="static")


# -------------------------------
#   MODELE WEJŚCIA
# -------------------------------
class TestRequest(BaseModel):
    url: HttpUrl
    count: int
    proxy_type: str = "none"
    proxy_host: Optional[str] = None
    proxy_port: Optional[str] = None
    proxy_username: Optional[str] = None
    proxy_password: Optional[str] = None
    owner_confirmed: bool


# -------------------------------
#   FUNKCJA POJEDYNCZEJ WIZYTY
# -------------------------------
async def run_single_visit(playwright, url: str, proxy_config: Optional[dict] = None):
    """Wykonuje jedno wejście na stronę wraz ze scrollowaniem."""
    try:
        browser = await playwright.chromium.launch(headless=True)

        context_options = {}

        if proxy_config:
            context_options["proxy"] = proxy_config
        
        context = await browser.new_context(**context_options)
        page = await context.new_page()

        # Wejście na stronę
        await page.goto(str(url), wait_until="networkidle")

        # Scrollowanie strony w dół
        await page.evaluate("""
            let total = 0;
            const step = 300;
            return new Promise(resolve => {
                const timer = setInterval(() => {
                    window.scrollBy(0, step);
                    total += step;
                    if (total >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 200);
            });
        """)

        await asyncio.sleep(2)
        
        await browser.close()
        return True
    except Exception as e:
        print(f"Błąd wizyty: {e}")
        return False


# -------------------------------
#   /run — GŁÓWNY ENDPOINT TESTU
# -------------------------------
@app.post("/run")
async def run_test(request: TestRequest):
    """Uruchamia test wejść na stronę."""
    
    # Walidacja właściciela
    if not request.owner_confirmed:
        raise HTTPException(
            status_code=403,
            detail="Musisz potwierdzić, że jesteś właścicielem testowanej strony"
        )
    
    # Walidacja ilości wejść
    if request.count < 1 or request.count > 100:
        raise HTTPException(
            status_code=400,
            detail="Liczba wejść musi być między 1 a 100"
        )

    # Konfiguracja proxy
    proxy_config = None

    if request.proxy_type != "none" and request.proxy_host and request.proxy_port:
        proxy_server = f"{request.proxy_type}://{request.proxy_host}:{request.proxy_port}"
        proxy_config = {"server": proxy_server}

        if request.proxy_username and request.proxy_password:
            proxy_config["username"] = request.proxy_username
            proxy_config["password"] = request.proxy_password

    # Start testu
    start_time = time.time()

    async with async_playwright() as pw:
        tasks = [
            run_single_visit(pw, request.url, proxy_config)
            for _ in range(request.count)
        ]

        results = await asyncio.gather(*tasks)

    execution_time = round(time.time() - start_time, 2)

    return {
        "success_count": results.count(True),
        "error_count": results.count(False),
        "proxy_used": proxy_config is not None,
        "execution_time": execution_time
    }


# -------------------------------
#   Tryb lokalny
# -------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



