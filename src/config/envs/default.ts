export const config = {
  db: {},
  port: process.env.PORT || 3333,
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  version: process.env.API_SYSTEM_VERSION || '1.0.0',
  consoleUrl: process.env.CONSOLE_URL || 'http://localhost:4000',
};
