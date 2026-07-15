import { Request, Response } from "express";
import { defaultOrder, defaultSort, pgMinLimit, defaultPage } from "../config";
import { SortEnum } from "../enums";
import {
  successResponseData,
  errorResponse,
} from "../utils";
import { CustomRequest } from "../middlewares";
import { SavingsGoalService } from "../services";
 
export class SavingsGoalController {
 
  constructor() {}
 
  static async create(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    try {
      const user = req.userId ? req.userId : null;
      let input = {
        ...req.body,
        user
      }
      const data = await new SavingsGoalService().create(input);
 
      return successResponseData({
        data,
        message: "Savings goal created successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating SavingsGoal:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }
 
  static async update(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.userId ? req.userId : null;
      let input = {
        ...req.body,
        user
      }
      const data = await new SavingsGoalService().update(id, input);
 
      return successResponseData({
        data,
        message: "Savings goal updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating SavingsGoal:", error);
 
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
 
      await new SavingsGoalService().delete(id);
 
      return successResponseData({
        message: "Savings goal deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting SavingsGoal:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async getMyGoals(req: CustomRequest, res: Response): Promise<void> {
    const user = req.userId;
    let { limit, sort, order, query, page, status } = req.query;
    sort = sort || defaultSort;
    query = query ? query.toString() : undefined;
    order = order ? order.toString() : defaultOrder.toString();
    status = status ? status.toString() : undefined;
    const validatedSort: SortEnum = sort as SortEnum;
    const parsedLimit = limit ? parseInt(limit as string) : pgMinLimit;
    const parsedPage = page ? parseInt(page as string) : defaultPage;
 
    try {
      const result = await new SavingsGoalService().getMyGoals({
        limit: parsedLimit,
        page: parsedPage,
        sort: validatedSort,
        order,
        query,
        status,
        user,
      });
 
      return successResponseData({
        data: result.data,
        metadata: result.metadata,
        message: "Savings goals retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getMyGoals:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async addContribution(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await new SavingsGoalService().addContribution(id, req.body);
 
      return successResponseData({
        data,
        message: "Contribution added successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error addContribution:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }
}
 