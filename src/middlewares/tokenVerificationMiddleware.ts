import { Request, Response, NextFunction, RequestHandler } from "express";
import { JWT } from "../utils";
import { UserService } from "../services";


export interface CustomRequest extends Request {
  userId?: string | null;
}

export const authenticateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reqToken = req.headers.authorization as string;
    let user;
    let decodedToken;
    if (!reqToken) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }
    let token = reqToken.replace("Bearer ", "");
    try {
      decodedToken = JWT.verifyAccessToken(token);
      if (decodedToken) {
        user = await new UserService().getById(decodedToken.id);
      }
    } catch (error: any) {
      return res.status(403).json({ message: `${error.message}` });
    }

    if (!user) {
      return res.status(403).json({
        message: "Unauthorized - user with that token is not found!!",
      });
    }
 
    req.userId = user?.id || null;
    next();
  } catch (error) {
    console.log(
      `middleware error ----------------------------------------- ${error}`,
    );
  }
};
