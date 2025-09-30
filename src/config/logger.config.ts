import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

export class LoggerConfig {
  static createWinstonLogger(configService: ConfigService) {
    const logLevel = configService.get('LOG_LEVEL', 'info');
    const logDir = configService.get('LOG_DIR', 'logs');
    
    // Custom format for console output
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context || 'Application'}] ${level}: ${message}${
          trace ? `\n${trace}` : ''
        }`;
      }),
    );

    // Custom format for file output
    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    const transports: winston.transport[] = [];

    // Console transport
    if (configService.get('NODE_ENV') !== 'production') {
      transports.push(
        new winston.transports.Console({
          format: consoleFormat,
          level: logLevel,
        }),
      );
    }

    // Error log file transport
    transports.push(
      new DailyRotateFile({
        filename: `${logDir}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: fileFormat,
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
      }),
    );

    // Combined log file transport
    transports.push(
      new DailyRotateFile({
        filename: `${logDir}/combined-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        format: fileFormat,
        maxSize: '20m',
        maxFiles: '30d',
        zippedArchive: true,
      }),
    );

    // HTTP requests log file transport
    transports.push(
      new DailyRotateFile({
        filename: `${logDir}/http-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        format: fileFormat,
        maxSize: '20m',
        maxFiles: '7d',
        zippedArchive: true,
        level: 'http',
      }),
    );

    return WinstonModule.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
      ),
      transports,
      exceptionHandlers: [
        new DailyRotateFile({
          filename: `${logDir}/exceptions-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true,
        }),
      ],
      rejectionHandlers: [
        new DailyRotateFile({
          filename: `${logDir}/rejections-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true,
        }),
      ],
    });
  }

  static getLoggerOptions(configService: ConfigService) {
    return {
      logger: this.createWinstonLogger(configService),
    };
  }
}

// Custom logger levels for HTTP requests
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
});