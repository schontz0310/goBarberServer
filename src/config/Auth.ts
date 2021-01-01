export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expiresIn: process.env.APP_JWT_EXPIRES_IN || '1d',
  },
};
