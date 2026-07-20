import { Request, Response } from "express";
import { defaultOrder, defaultSort, pgMinLimit, defaultPage } from "../config";
import { SortEnum } from "../enums";
import { successResponseData, errorResponse } from "../utils";
import { CustomRequest } from "../middlewares";
import { LoanService } from "../services";
 
export class LoanController {
  constructor() {}
 
  static async create(req: CustomRequest, res: Response): Promise<void> {
    try {
      const user = req.userId ? req.userId : null;
      let input = {
        ...req.body,
        user,
      };
      const data = await new LoanService().create(input);
 
      return successResponseData({
        data,
        message: "Loan created successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating Loan:", error);
 
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
      const data = await new LoanService().update(id, req.body);
 
      return successResponseData({
        data,
        message: "Loan updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating Loan:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 400,
        res,
      });
    }
  }
 
  static async updateStatus(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await new LoanService().updateStatus(id, status);
 
      return successResponseData({
        data,
        message: "Loan status updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating Loan status:", error);
 
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
 
      await new LoanService().delete(id);
 
      return successResponseData({
        message: "Loan deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting Loan:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async getMyLoans(req: CustomRequest, res: Response): Promise<void> {
    const user = req.userId;
    let { limit, sort, order, query, page, type, status } = req.query;
    sort = sort || defaultSort;
    query = query ? query.toString() : undefined;
    order = order ? order.toString() : defaultOrder.toString();
    type = type ? type.toString() : undefined;
    status = status ? status.toString() : undefined;
    const validatedSort: SortEnum = sort as SortEnum;
    const parsedLimit = limit ? parseInt(limit as string) : pgMinLimit;
    const parsedPage = page ? parseInt(page as string) : defaultPage;
 
    try {
      const result = await new LoanService().getMyLoans({
        limit: parsedLimit,
        page: parsedPage,
        sort: validatedSort,
        order,
        query,
        type,
        status,
        user,
      });
 
      return successResponseData({
        data: result.data,
        metadata: result.metadata,
        message: "Loans retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getMyLoans:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
}