# Smart EV Solar Charger - Installation & Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Android Studio or Android device/emulator
- Expo CLI: `npm install -g expo-cli`

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000/docs`

### Mobile App Setup

```bash
cd mobile-app
npm install
# Update API_BASE_URL in your config
npx expo start
# Press 'a' for Android or 'i' for iOS
```

## Configuration

### Backend (.env file)

```env
SMARTLIFE_USERNAME=your_email@gmail.com
SMARTLIFE_PASSWORD=your_password
SMARTLIFE_DEVICE_ID=Your_Charger_ID
SMARTLIFE_REGION=EU

SUNPOWER_CLIENT_ID=your_client_id
SUNPOWER_CLIENT_SECRET=your_secret
SUNPOWER_REFRESH_TOKEN=your_token

DATABASE_URL=postgres://user:pass@localhost/ev_solar_charger
API_PORT=8000
MIN_SURPLUS_FOR_CHARGE=0.5
TARGET_CHARGE_LEVEL=80
```

### Mobile App Configuration

Update `mobile-app/config/api.ts`:

```typescript
export const API_BASE_URL = 'http://your-backend-ip:8000';
export const POLLING_INTERVAL = 5000; // 5 seconds
```

## Features

✅ **Real-time Solar Monitoring**
- Live solar production (kW)
- Daily/total energy generation
- Solar balance & surplus calculation

✅ **EV Charger Control**
- Start/stop charging
- Set target battery level
- Real-time power draw monitoring
- Battery level tracking

✅ **Intelligent Automation**
- Charge only when solar surplus available
- Automatic start/stop based on thresholds
- Manual override capability
- Customizable rules

✅ **Dashboard & Analytics**
- Dark mode UI with accent colors
- Real-time charts and graphs
- Daily energy summary
- CO₂ savings calculation
- Charge history timeline

✅ **Notifications**
- Charging events
- Battery level milestones
- Solar production alerts
- Automation status updates

## API Endpoints

### Solar Data
- `GET /api/solar/production` - Current solar output
- `GET /api/solar/status` - System status (grid, load, surplus)

### Charger Control
- `GET /api/charger/status` - Current charger status
- `POST /api/charger/command` - Start/stop/set power

### Automation
- `GET /api/automation/decision` - Get charging decision
- `POST /api/automation/execute` - Execute decision
- `GET /api/automation/status` - Automation status

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check port 8000 is free
lsof -i :8000  # On macOS/Linux
netstat -ano | findstr :8000  # On Windows
```

### Mobile app can't connect to backend
- Ensure backend is running: `http://localhost:8000/health`
- Check firewall settings
- Use your actual IP (not localhost) on real device
- Verify API_BASE_URL is correct

### SmartLife/Tuya not connecting
- Verify credentials in `.env`
- Check device ID is correct
- Ensure device is online in SmartLife app
- Check region setting matches your account

### SunPower authentication fails
- Verify OAuth2 tokens are valid
- Refresh token may need renewal
- Check SunPower API rate limits

## Development

### Adding new features
1. Update backend service in `backend/app/services/`
2. Add API endpoint in `backend/app/api/routes/`
3. Update mobile UI in `mobile-app/App.tsx`
4. Test with Expo: `expo start`

### Database setup (PostgreSQL)
```bash
creatdb ev_solar_charger
# Update DATABASE_URL in .env
```

### Building for production
```bash
# Android APK
expo build:android -t apk

# Backend deployment
# Use gunicorn for production
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

## Support

For issues and feature requests, open an issue on GitHub.

## License

MIT License - See LICENSE file for details
