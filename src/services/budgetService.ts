import {
  InputBudgetInterface,
  BudgetInterface,
  ArgsBudgetInterface,
  PaginationMetadata,
} from "../interfaces";
import { budgetModel, transactionModel } from "../models";
import { TransactionTypeEnum } from "../enums";
 
export class BudgetService {
 
  async create(
    input: InputBudgetInterface
  ): Promise<BudgetInterface> {
    const overlapping = await budgetModel.findOne({
      user: input.user,
      category: input.category,
      name:input.name,
      deletedAt: null,
      startDate: { $lte: input.endDate },
      endDate: { $gte: input.startDate },
    });
    if (overlapping) {
      throw new Error(`A budget already exists for this category in the given period`);
    }
    const data = await budgetModel.create(input);
    return data;
  }
 
  async update(
    id: string,
    updates: Partial<InputBudgetInterface>
  ): Promise<BudgetInterface | null> {
    const dataExists = await budgetModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (dataExists) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const updatedData = await budgetModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedData) throw new Error(`Failed to update id : ${id} `);
    return updatedData;
  }
 
  async delete(id: string): Promise<any> {
    const deletedData = await budgetModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (deletedData) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const deleted = await budgetModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return deleted;
  }
 
  async getMyBudgets({
    page,
    limit,
    query,
    sort,
    order,
    period,
    category,
    isActive,
    user
  }: ArgsBudgetInterface): Promise<{
    metadata?: PaginationMetadata;
    data: { count?: number; rows: BudgetInterface[] };
  }> {
    try {
      if (isNaN(page) || isNaN(limit)) {
        throw new Error("Invalid page or limit");
      }
 
      const skip = Math.max(page - 1, 0) * limit;
 
      const filter: any = {
        user,
        deletedAt: null,
      };
      
       if (query) {
      filter.name = {
        $regex: query,
        $options: "i",
      };
    }
      if (period) filter.period = period;
      if (category) filter.category = category;
      if (isActive !== undefined) filter.isActive = isActive;
 
      const sortField = sort || "startDate";
      const sortOrder = order === "asc" ? 1 : -1;
      const count = await budgetModel.countDocuments(filter);
 
      const data = await budgetModel
        .find(filter)
        .select("-deletedAt")
        .populate({
          path: "category",
          select: "_id name type icon color",
        })
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
 
      const metadata: PaginationMetadata = {
        previousPage: page > 1 ? page - 1 : null,
        currentPage: page,
        nextPage: skip + data.length < count ? page + 1 : null,
        perPage: limit,
      };
 
      return {
        metadata,
        data: {
          count,
          rows: data,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }
 
  // Compares a budget's limit against actual spend on its category within its date range
  async getBudgetStatus(id: string): Promise<{
    budget: BudgetInterface;
    spent: number;
    remaining: number;
    percentUsed: number;
    isExceeded: boolean;
  }> {
    const budget = await budgetModel.findOne({ _id: id, deletedAt: null }).populate({
      path: "category",
      select: "_id name type icon color",
    });
    if (!budget) {
      throw new Error(`Given id: ${id} is not found`);
    }
 
    const result = await transactionModel.aggregate([
      {
        $match: {
          user: budget.user,
          category: budget.category._id ? budget.category._id : budget.category,
          type: TransactionTypeEnum.EXPENSE,
          deletedAt: null,
          date: { $gte: budget.startDate, $lte: budget.endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
 
    const spent = result[0]?.total || 0;
    const remaining = budget.limitAmount - spent;
    const percentUsed = budget.limitAmount ? Math.round((spent / budget.limitAmount) * 100) : 0;
 
    return {
      budget,
      spent,
      remaining,
      percentUsed,
      isExceeded: spent > budget.limitAmount,
    };
  }
}