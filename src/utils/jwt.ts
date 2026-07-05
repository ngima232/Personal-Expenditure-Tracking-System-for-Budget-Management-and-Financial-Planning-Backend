import jsonWebToken from "jsonwebtoken";
import {
  jwtAccessTokenExpiryTime,
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtRefreshTokenExpiryTime,
} from "../config";
import { TokenExpiredError } from "jsonwebtoken";
class JWT {
  private static instance: JWT;

  private constructor() {}

  static get(): JWT {
    if (!JWT.instance) {
      JWT.instance = new JWT();
    }
    return JWT.instance;
  }
  createAccessToken(payload: any) {
    return jsonWebToken.sign(payload, jwtAccessSecret, {
      expiresIn: "7d",
    });
  }

  verifyAccessToken(token: string): any {
    try {
      const decoded = jsonWebToken.verify(token, jwtAccessSecret);
      return decoded;
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Access token has expired.");
      } else {
        throw new Error("Access token verification failed:");
      }
    }
  }

  createRefreshToken(payload: any) {
    return jsonWebToken.sign(payload, jwtRefreshSecret, {
      expiresIn: "7d",
    });
  }

  verifyRefreshToken(token: any) {
    try {
      const decoded = jsonWebToken.verify(token, jwtRefreshSecret);
      return decoded;
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Refresh token has expired.");
      } else {
        throw error("Refresh token verification failed:", error.message);
      }
    }
  }
}

const jwt = JWT.get();

export { jwt as JWT };
