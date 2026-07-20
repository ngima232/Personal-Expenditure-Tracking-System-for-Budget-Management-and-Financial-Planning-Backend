import { Request, Response } from "express";
import { defaultOrder, defaultSort, pgMinLimit, defaultPage } from "../config";
import { SortEnum } from "../enums";
import { successResponseData, errorResponse } from "../utils";
import { CustomRequest } from "../middlewares";
import { InvestmentService } from "../services";

export class InvestmentController {
  static async create(req: CustomRequest, res: Response): Promise<void> {
    try {
      const user = req.userId;
      if (!user) throw new Error("User not authenticated");
      const input = { ...req.body, user };
      const data = await new InvestmentService().create(input);
      return successResponseData({
        data,
        message: "Investment created successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating investment:", error);
      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }

  static async update(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.userId;
      if (!user) throw new Error("User not authenticated");
      const input = { ...req.body, user };
      const data = await new InvestmentService().update(id, input);
      return successResponseData({
        data,
        message: "Investment updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating investment:", error);
      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }

  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await new InvestmentService().delete(id);
      return successResponseData({
        message: "Investment deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting investment:", error);
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }

  static async getMyInvestments(req: CustomRequest, res: Response): Promise<void> {
    const user = req.userId;
    if (!user) {
      return errorResponse({ errorMessage: "Unauthorized", statusCode: 401, res });
    }

    let { limit, sort, order, query, page, type, startDate, endDate } = req.query;
    sort = sort || defaultSort;
    order = order ? order.toString() : defaultOrder.toString();
    query = query ? query.toString() : undefined;
    type = type ? type.toString() : undefined;
    startDate = startDate ? startDate.toString() : undefined;
    endDate = endDate ? endDate.toString() : undefined;

    const validatedSort: SortEnum = sort as SortEnum;
    const parsedLimit = limit ? parseInt(limit as string) : pgMinLimit;
    const parsedPage = page ? parseInt(page as string) : defaultPage;

    try {
      const result = await new InvestmentService().getMyInvestments({
        limit: parsedLimit,
        page: parsedPage,
        sort: validatedSort,
        order,
        query,
        type,
        user,
        startDate,
        endDate,
      });

      return successResponseData({
        data: result.data,
        metadata: result.metadata,
        message: "Investments retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getMyInvestments:", error);
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
}