const baseUrl = 'http://localhost:8080';

const config = {
  baseUrl,
  authUrl: `${baseUrl}/auth`,
  cdnUrl: `${baseUrl}/cdn`,
  gradeUrl: `${baseUrl}/grades`,
  auth: {
    isEnabled: true
  },
  cdn: {
    isEnabled: true
  },
  gradeCheck: {
    isEnabled: true
  },
  proxy: {
    isEnabled: true
  }
};

module.exports = config;
