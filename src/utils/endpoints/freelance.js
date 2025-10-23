export const FREELANCE_ENDPOINTS = {
  MISSIONS: '/api/freelance/missions',
  MISSION_BY_ID: id => `/api/freelance/missions/${id}`,
  APPLY: id => `/api/freelance/missions/${id}/apply`,
  APPLICATIONS: '/api/freelance/applications',
  DASHBOARD: '/api/freelance/dashboard',
};