from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import solar, charger, automation
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

app.include_router(solar.router, prefix="/api/solar", tags=["solar"])
app.include_router(charger.router, prefix="/api/charger", tags=["charger"])
app.include_router(automation.router, prefix="/api/automation", tags=["automation"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "ev-solar-charger"}


@app.get("/")
def root():
    return {
        "message": "EV Solar Charger backend is running.",
        "docs": "/docs",
    }


@app.on_event("startup")
async def startup_event():
    logger.info("🚀 EV Solar Charger API started")
    logger.info("📊 Dashboard: http://localhost:3000")
    logger.info("📚 API Docs: http://localhost:8000/docs")
