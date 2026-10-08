from fastapi import APIRouter
from app.config import SolarProduction, ChargerStatus, ChargeCommand

router = APIRouter()


@router.get("/production")
def get_solar_production() -> SolarProduction:
    return SolarProduction(
        timestamp="2026-10-08T12:00:00Z",
        power_kw=3.8,
        energy_today_kwh=18.6,
        energy_total_kwh=12480.4,
    )


@router.get("/status")
def get_solar_status() -> dict:
    return {
        "grid_import_kw": 0.7,
        "house_load_kw": 2.1,
        "surplus_kw": 1.7,
        "recommended_ev_charge_kw": 2.2,
    }
