from pydantic import BaseModel, Field
from typing import Optional


class SolarProduction(BaseModel):
    timestamp: str
    power_kw: float = Field(..., description="Current solar power output in kW")
    energy_today_kwh: float = Field(..., description="Solar energy generated today in kWh")
    energy_total_kwh: float = Field(..., description="Lifetime total solar energy in kWh")


class ChargerStatus(BaseModel):
    connected: bool
    charging: bool
    power_kw: float
    battery_level: int
    target_level: int
    mode: str = "solar"


class ChargeCommand(BaseModel):
    action: str = Field(..., description="start, stop, pause, resume")
    target_percent: Optional[int] = Field(default=None, ge=0, le=100)
