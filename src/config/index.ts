import * as dotenv from 'dotenv';
import { EnvironmentEnum, SortEnum } from "../enums";
dotenv.config();

/**
 * Your favorite port
 */
export const port = parseInt(process.env.PORT!) as number,


  /**
   * Application mode (Set the environment to 'development' by default)
   */
  environment = process.env.ENVIRONMENT! as EnvironmentEnum,

  /**
  * HOST URL
  */
  hostUrl = process.env.HOST_URL as string,

  /**
   * Database Connection
   */

  url = process.env.DB_URL,

   // JWT access expires in
  jwtAccessSecret = process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwtAccessTokenExpiryTime = process.env.JWT_ACCESS_TOKEN_EXPIRY_IN!,
  jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET!,
  jwtRefreshTokenExpiryTime = process.env.JWT_REFRESH_EXPIRES_IN!,

  // crypto
ENCRYPTION_KEY = process.env.ENCRYPTION_KEY,

  /**** smtp */
  smtpUser = process.env.SMTP_USER,
  smtpPassword = process.env.SMTP_PASS,
  smtpService = process.env.SMTP_SERVICE,
  smtpPort = process.env.SMTP_PORT,
  smtpHost = process.env.SMTP_HOST,
  smtpSender = process.env.SMTP_SENDER,

  /** Pagination */
  pgMinLimit = 10,
  pgMaxLimit = 100,
  defaultOffset = 1,
  defaultLimit = 10,
  defaultPage = 1,

  /** Order */
  defaultOrder = 'createdAt',
  defaultSort = SortEnum.desc


export * from './instance';

