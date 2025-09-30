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
        autoLoadEntities: true
    }
}