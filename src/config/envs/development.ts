export const config = {
  db: {
    type: 'postgres',
    synchronize: false,
    logging: true,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'abc123xyz',
    database: process.env.DB_DATABASE || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
  },
  port: process.env.PORT || 3333,
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  version: process.env.API_SYSTEM_VERSION || '1.0.0',
  consoleUrl: process.env.CONSOLE_URL || 'http://localhost:4000',
};
