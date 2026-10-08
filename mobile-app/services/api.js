import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const solarAPI = {
  getProduction: () => api.get('/api/solar/production'),
  getStatus: () => api.get('/api/solar/status'),
};

export const chargerAPI = {
  getStatus: () => api.get('/api/charger/status'),
  sendCommand: (action, targetPercent) =>
    api.post('/api/charger/command', {
      action,
      target_percent: targetPercent,
    }),
};

export const automationAPI = {
  getDecision: () => api.get('/api/automation/decision'),
  execute: () => api.post('/api/automation/execute'),
  getStatus: () => api.get('/api/automation/status'),
};

export default api;
