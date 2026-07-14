import { Types, Document } from 'mongoose';
import { TransactionTypeEnum, PaymentMethodEnum, RecurrenceFrequencyEnum } from '../enums';
import {
  InputTransactionInterface,
  TransactionInterface,
  ArgsTransactionInterface,
  PaginationMetadata,
} from "../interfaces";
import { transactionModel } from "../models";
 
export class TransactionService {
 
  async create(
    input: InputTransactionInterface
  ): Promise<TransactionInterface> {
     const dataExist = await transactionModel.findOne({
       category: input.category,
       type: input.type, 
       date: input.date, 
       amount: input.amount ,
       description: input.description,
      deletedAt: { $ne: null },
    });
     if (dataExist) throw new Error("this Transaction is already Exist");
    const data = await transactionModel.create(input);
    return data;
  }
 
  async update(
    id: string,
    updates: Partial<InputTransactionInterface>
  ): Promise<TransactionInterface | null> {

    const dataExists = await transactionModel.findOne({
      _id: id,
      user: updates.user,
      deletedAt: { $ne: null },
    });
    if (dataExists) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const updatedData = await transactionModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedData) throw new Error(`Failed to update id : ${id} `);
    return updatedData;
  }
 
  async delete(id: string): Promise<any> {
    const deletedData = await transactionModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (deletedData) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const deleted = await transactionModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return deleted;
  }
 
  async getMyTransactions({
    page,
    limit,
    query,
    sort,
    order,
    type,
    category,
    paymentMethod,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    user,
  }: ArgsTransactionInterface): Promise<{
    metadata?: PaginationMetadata;
    data: { count?: number; rows: TransactionInterface[] };
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
        filter.description = {
          $regex: query,
          $options: "i",
        };
      }
 
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (paymentMethod) filter.paymentMethod = paymentMethod;
 
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
 
      if (minAmount || maxAmount) {
        filter.amount = {};
        if (minAmount) filter.amount.$gte = minAmount;
        if (maxAmount) filter.amount.$lte = maxAmount;
      }
 
      const sortField = sort || "date";
      const sortOrder = order === "asc" ? 1 : -1;
      const count = await transactionModel.countDocuments(filter);
 
      const data = await transactionModel
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
 
  // Powers dashboard cards: total income, total expense, net balance for a date range
  async getSummary({
    user,
    startDate,
    endDate,
  }: {
    user: Types.ObjectId | any;
    startDate?: string;
    endDate?: string;
  }): Promise<{ totalIncome: number; totalExpense: number; netBalance: number }> {
    const match: any = { user, deletedAt: null };
 
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }
 
    const results = await transactionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);
 
    const totalIncome = results.find((r) => r._id === TransactionTypeEnum.INCOME)?.total || 0;
    const totalExpense = results.find((r) => r._id === TransactionTypeEnum.EXPENSE)?.total || 0;
 
    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }
}
 