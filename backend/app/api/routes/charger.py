from fastapi import APIRouter
from app.config import ChargerStatus, ChargeCommand

router = APIRouter()


@router.get("/status")
def get_charger_status() -> ChargerStatus:
    return ChargerStatus(
        connected=True,
        charging=True,
        power_kw=2.3,
        battery_level=72,
        target_level=80,
        mode="solar",
    )


@router.post("/command")
def send_charger_command(command: ChargeCommand) -> dict:
    return {
        "status": "accepted",
        "action": command.action,
        "target_percent": command.target_percent,
        "message": "Command queued. Integrate your charger API to complete execution.",
    }
