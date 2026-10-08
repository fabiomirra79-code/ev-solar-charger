# EV Solar Charger

A complete smart energy app for monitoring and controlling an EV charger using solar production data.

## Stack

- Android app: React Native + Expo
- Backend API: FastAPI (Python)
- Database: PostgreSQL (ready for integration)
- Dashboard: React web (planned next step)

## Project structure

- `backend/` — FastAPI API for solar/charger data and automation logic
- `mobile-app/` — Expo Android app UI/dashboard
- `docs/` — future project documentation

## Features included in this base version

- FastAPI health endpoint
- Solar production endpoint mock schema
- EV charger control endpoint mock schema
- Android UI prototype with dashboard cards and action buttons
- Clean dark theme and mobile-first layout

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open: http://localhost:8000/docs

### Mobile app

```bash
cd mobile-app
npm install
npx expo start
```

Then run on Android device/emulator.

## Notes

This project is intentionally set up as a solid base for integrating:

- SunPower/Maxeon OAuth2 API
- Smart321 EV charger API or bridge
- automatic solar surplus charging logic
- historical energy analytics

## Next steps

1. Connect real SunPower API
2. Connect real Smart321 charger API
3. Add auth and storage
4. Add scheduler + automation rules
5. Add web dashboard
