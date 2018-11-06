
export default {
  environment: process.env.NODE_ENV,
  api: {
    url: process.env.REACT_APP_API_HOST || 'http://localhost:8000/api/v1',
  },
  cookies: {
    token: 'token',
  },
};