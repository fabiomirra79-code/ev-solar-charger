from fastapi import APIRouter, Depends
from app.services.smartlife_service import SmartLifeService
from app.services.sunpower_service import SunPowerService
from app.services.automation_service import AutomationService

router = APIRouter()


def get_automation_service() -> AutomationService:
    smartlife = SmartLifeService()
    sunpower = SunPowerService()
    return AutomationService(smartlife, sunpower)


@router.get("/decision")
def get_charging_decision(service: AutomationService = Depends(get_automation_service)):
    """Get the current charging decision based on solar surplus."""
    return service.decide_charging()


@router.post("/execute")
def execute_charging_decision(service: AutomationService = Depends(get_automation_service)):
    """Execute the current charging decision."""
    return service.execute_decision()


@router.get("/status")
def get_automation_status(service: AutomationService = Depends(get_automation_service)):
    """Get the status of the automation system."""
    decision = service.decide_charging()
    return {
        "automation_active": True,
        "last_decision": decision,
        "min_surplus_kw": service.min_surplus_kw,
        "target_charge_level": service.target_charge_level,
    }
