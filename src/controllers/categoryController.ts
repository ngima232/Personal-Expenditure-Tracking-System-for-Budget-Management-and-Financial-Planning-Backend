import { Request, Response } from "express";
import { defaultOrder, defaultSort, pgMinLimit, defaultPage } from "../config";
import { SortEnum } from "../enums";
import {
  successResponseData,
  errorResponse,
  JWT,
} from "../utils";
import { CustomRequest } from "../middlewares";
import { CategoryService } from "../services";

export class CategoryController {

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
        const data = await new CategoryService().create(input);

      return successResponseData({
        data,
        message: "Category created successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error creating Category:", error);

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
      const data =await new CategoryService().update(
        id,
       input
      );

      return successResponseData({
        data,
        message: "Category updated successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error updating Category:", error);

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

      await new CategoryService().delete(id);

      return successResponseData({
        message: "Category deleted successfully.",
        res,
      });
    } catch (error: any) {
      console.error("Error deleting Category:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }

 static async getMyCategory(req: CustomRequest, res: Response): Promise<void> {
       const user = req.userId;
    let { limit, sort, order, query, page, name, type  } =
      req.query;
    sort = sort || defaultSort;
    query = query ? query.toString() : undefined;
    order = order ? order.toString() : defaultOrder.toString();
    type = type ? type.toString() : undefined;
    name = name ? name.toString() : undefined;
    const validatedSort: SortEnum = sort as SortEnum;
    const parsedLimit = limit ? parseInt(limit as string) : pgMinLimit;
    const parsedPage = page ? parseInt(page as string) : defaultPage;

    try {
      const result = await new CategoryService().getMyCategory({
        limit: parsedLimit,
        page: parsedPage,
        sort: validatedSort,
        order,
        query,
        name,
        type, 
        user
      });

      return successResponseData({
        data: result.data,
        metadata: result.metadata,
        message: "Categories retrieved.",
        res,
      });
    } catch (error: any) {
       console.error("Error getMyCategory:", error);

      return errorResponse({
        errorMessage: error,
        statusCode: 404,
        res,
      });
    }
  }
}

