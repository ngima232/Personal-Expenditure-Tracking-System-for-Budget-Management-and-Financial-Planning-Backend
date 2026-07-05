import { Request, Response } from "express";
import { userService } from "../services";
import {
  successResponseData,
  errorResponse,
  JWT,
} from "../utils";

export class UserController {

  constructor() {}


  static async create(
    req: Request,
    res: Response,
    // imagePath?: string
  ): Promise<void> {
    try {
      const data = req.body;

      // if (imagePath) {
      //   data.image = imagePath;
      // }

     // const user = await this.service.create(data);
        const user = await new userService().create(data);

      return successResponseData({
        data: user,
        message: "User registered successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating user:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }

  static async update(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const updatedUser =await new userService().update(
        id,
        req.body
      );

      return successResponseData({
        data: updatedUser,
        message: "User updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating user:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }

  static async remove(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      await new userService().delete(id);

      return successResponseData({
        message: "User deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }

  static async login(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const user = await new userService().login(req.body);

      const payload = {
        id: user!._id,
        name: user!.name,
      };

      const accessToken = JWT.createAccessToken(payload);
      const refreshToken = JWT.createRefreshToken(payload);

      return successResponseData({
        data: {
          user,
          accessToken,
          refreshToken,
        },
        message: "Login successful.",
        res,
      });
    } catch (error: any) {
      console.error("Error logging in user:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 401,
        res,
      });
    }
  }

  static async changePassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      await new userService().changePassword(req.body);

      return successResponseData({
        message: "Password changed successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error changing password:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }
}

