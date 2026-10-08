import logging
from typing import Dict
from datetime import datetime
from app.services.smartlife_service import SmartLifeService
from app.services.sunpower_service import SunPowerService

logger = logging.getLogger(__name__)


class AutomationService:
    """Service for solar-powered EV charging automation logic."""

    def __init__(
        self,
        smartlife_service: SmartLifeService,
        sunpower_service: SunPowerService,
        min_surplus_kw: float = 0.5,
        target_charge_level: int = 80,
    ):
        self.smartlife = smartlife_service
        self.sunpower = sunpower_service
        self.min_surplus_kw = min_surplus_kw
        self.target_charge_level = target_charge_level
        self.last_decision = None

    def decide_charging(self) -> Dict:
        """Determine if the EV should be charged based on solar surplus."""
        try:
            # Get current data
            charger_status = self.smartlife.get_charger_status()
            solar_status = self.sunpower.get_solar_status()

            surplus_kw = solar_status.get("surplus_kw", 0)
            battery_level = charger_status.get("battery_level", 0)
            target_level = self.target_charge_level
            is_charging = charger_status.get("charging", False)

            # Decision logic
            should_charge = (
                surplus_kw >= self.min_surplus_kw
                and battery_level < target_level
            )

            # If surplus dropped below minimum and charging, stop
            should_stop = (
                is_charging
                and surplus_kw < self.min_surplus_kw * 0.8
                and battery_level < target_level
            )

            decision = {
                "timestamp": datetime.utcnow().isoformat(),
                "surplus_kw": surplus_kw,
                "battery_level": battery_level,
                "target_level": target_level,
                "is_charging": is_charging,
                "should_charge": should_charge,
                "should_stop": should_stop,
                "reason": self._get_decision_reason(
                    should_charge, should_stop, surplus_kw, battery_level
                ),
            }

            self.last_decision = decision
            logger.info(f"Charging decision: {decision}")
            return decision
        except Exception as e:
            logger.error(f"Error in charging decision: {e}")
            return {"error": str(e), "should_charge": False}

    def _get_decision_reason(self, should_charge, should_stop, surplus, level):
        """Generate human-readable reason for decision."""
        if should_stop:
            return "Surplus dropped below threshold. Stopping charge."
        if should_charge:
            return f"Surplus available ({surplus:.1f} kW). Starting charge."
        if level >= self.target_charge_level:
            return f"Battery already at target level ({level}%). Charge not needed."
        return f"Insufficient surplus ({surplus:.1f} kW). Waiting for more PV."

    def execute_decision(self) -> Dict:
        """Execute the last decision: start/stop charging."""
        if not self.last_decision:
            return {"error": "No decision available. Call decide_charging first."}

        try:
            decision = self.last_decision

            if decision.get("should_charge") and not decision.get(
                "is_charging"
            ):
                result = self.smartlife.start_charging(
                    self.target_charge_level
                )
                logger.info(f"Charging started: {result}")
                return result

            elif decision.get("should_stop") and decision.get("is_charging"):
                result = self.smartlife.stop_charging()
                logger.info(f"Charging stopped: {result}")
                return result

            return {
                "status": "no_action",
                "message": "No action needed at this time.",
            }
        except Exception as e:
            logger.error(f"Error executing decision: {e}")
            return {"status": "error", "message": str(e)}
