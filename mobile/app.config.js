// Dynamic config — reads API_URL from environment at build time
// Usage: API_URL=http://192.168.1.x:8000 npx expo start
const baseConfig = require('./app.json');

module.exports = {
  ...baseConfig.expo,
  extra: {
    ...baseConfig.expo.extra, // keep existing extras (if any)
    apiUrl: process.env.API_URL || 'https://brave-success-production.up.railway.app',
    eas: {
      projectId: "8aefbd0d-321d-4e56-b92b-0a12db0649c9"
    }
  },
};