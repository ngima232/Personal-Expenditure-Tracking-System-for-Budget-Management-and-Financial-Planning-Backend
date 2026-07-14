import { Request, Response } from "express";
import { defaultOrder, defaultSort, pgMinLimit, defaultPage } from "../config";
import { SortEnum } from "../enums";
import {
  successResponseData,
  errorResponse,
} from "../utils";
import { CustomRequest } from "../middlewares";
import { TransactionService } from "../services";
 
export class TransactionController {
 
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
      const data = await new TransactionService().create(input);
 
      return successResponseData({
        data,
        message: "Transaction created successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating Transaction:", error);
 
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
      const data = await new TransactionService().update(id, input);
 
      return successResponseData({
        data,
        message: "Transaction updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating Transaction:", error);
 
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
 
      await new TransactionService().delete(id);
 
      return successResponseData({
        message: "Transaction deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting Transaction:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async getMyTransactions(req: CustomRequest, res: Response): Promise<void> {
    const user = req.userId;
    let { limit, sort, order, query, page, type, category, paymentMethod, startDate, endDate, minAmount, maxAmount } = req.query;
    sort = sort || defaultSort;
    query = query ? query.toString() : undefined;
    order = order ? order.toString() : defaultOrder.toString();
    type = type ? type.toString() : undefined;
    category = category ? category.toString() : undefined;
    paymentMethod = paymentMethod ? paymentMethod.toString() : undefined;
    startDate = startDate ? startDate.toString() : undefined;
    endDate = endDate ? endDate.toString() : undefined;
    const validatedSort: SortEnum = sort as SortEnum;
    const parsedLimit = limit ? parseInt(limit as string) : pgMinLimit;
    const parsedPage = page ? parseInt(page as string) : defaultPage;
 
    try {
      const result = await new TransactionService().getMyTransactions({
        limit: parsedLimit,
        page: parsedPage,
        sort: validatedSort,
        order,
        query,
        type,
        category,
        paymentMethod,
        startDate,
        endDate,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
        user,
      });
 
      return successResponseData({
        data: result.data,
        metadata: result.metadata,
        message: "Transactions retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getMyTransactions:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
 
  static async getSummary(req: CustomRequest, res: Response): Promise<void> {
    const user = req.userId;
    let { startDate, endDate } = req.query;
 
    try {
      const data = await new TransactionService().getSummary({
        user,
        startDate: startDate ? startDate.toString() : undefined,
        endDate: endDate ? endDate.toString() : undefined,
      });
 
      return successResponseData({
        data,
        message: "Summary retrieved.",
        res,
      });
    } catch (error: any) {
      console.error("Error getSummary:", error);
 
      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
}
 