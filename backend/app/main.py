from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import solar, charger

app = FastAPI(
    title="EV Solar Charger API",
    description="API for solar-powered EV charging automation",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(solar.router, prefix="/solar", tags=["solar"])
app.include_router(charger.router, prefix="/charger", tags=["charger"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "ev-solar-charger"}


@app.get("/")
def root():
    return {"message": "EV Solar Charger backend is running."}
