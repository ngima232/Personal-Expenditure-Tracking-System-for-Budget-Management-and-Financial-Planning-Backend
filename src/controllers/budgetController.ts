import { Request, Response } from "express";
import { defaultOrder, defaultSort, pgMinLimit, defaultPage } from "../config";
import { SortEnum } from "../enums";
import {
  successResponseData,
  errorResponse,
} from "../utils";
import { CustomRequest } from "../middlewares";
import { BudgetService } from "../services";
 
export class BudgetController {
 
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
      const data = await new BudgetService().create(input);
 
      return successResponseData({
        data,
        message: "Budget created successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating Budget:", error);
 
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
      const data = await new BudgetService().update(id, input);
 
      return successResponseData({
        data,
        message: "Budget updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating Budget:", error);
 
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
 
      await new BudgetService().delete(id);
 
      return successResponseData({
        message: "Budget deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting Budget:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async getMyBudgets(req: CustomRequest, res: Response): Promise<void> {
    const user = req.userId;
    let { limit, sort, order, query, page, period, category, isActive } = req.query;
    sort = sort || defaultSort;
    query = query ? query.toString() : undefined;
    order = order ? order.toString() : defaultOrder.toString();
    period = period ? period.toString() : undefined;
    category = category ? category.toString() : undefined;
    const validatedSort: SortEnum = sort as SortEnum;
    const parsedLimit = limit ? parseInt(limit as string) : pgMinLimit;
    const parsedPage = page ? parseInt(page as string) : defaultPage;
 
    try {
      const result = await new BudgetService().getMyBudgets({
        limit: parsedLimit,
        page: parsedPage,
        sort: validatedSort,
        order,
        query,
        period,
        category,
        isActive: isActive !== undefined ? isActive === "true" : undefined,
        user,
      });
 
      return successResponseData({
        data: result.data,
        metadata: result.metadata,
        message: "Budgets retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getMyBudgets:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async getBudgetStatus(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await new BudgetService().getBudgetStatus(id);
 
      return successResponseData({
        data,
        message: "Budget status retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getBudgetStatus:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
}