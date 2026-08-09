import { Types, Document } from 'mongoose';
import { TransactionTypeEnum, PaymentMethodEnum, RecurrenceFrequencyEnum,ForecastMethod } from '../enums';
import {
  InputTransactionInterface,
  TransactionInterface,
  ArgsTransactionInterface,
  PaginationMetadata,
} from "../interfaces";
import { transactionModel,categoryModel } from "../models";
import { holtLinearTrend } from '../helpers'
import {forecastExpense  } from "../helpers";
function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}


function formatMonth(date: Date): string {
  return date.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
}


function fillMissingMonths(
  history: {
    month: string;
    amount: number;
  }[],
  currentMonthStart: Date
): {
  month: string;
  amount: number;
}[] {

  if (!history.length) {
    return [];
  }

  /**
   * First recorded month for this category.
   */
  const [firstYear, firstMonth] =
    history[0].month
      .split("-")
      .map(Number);

  let cursor = new Date(
    firstYear,
    firstMonth - 1,
    1
  );

  const result: {
    month: string;
    amount: number;
  }[] = [];

  const historyMap =
    new Map<string, number>();

  history.forEach((item) => {
    historyMap.set(
      item.month,
      item.amount
    );
  });

  /**
   * Continue until the month
   * BEFORE the current month.
   */
  while (cursor < currentMonthStart) {

    const monthKey =
      getMonthKey(cursor);

    result.push({
      month: monthKey,

      amount:
        historyMap.get(monthKey) || 0,
    });

    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      1
    );
  }

  return result;
}
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

//   async getExpenseForecast({
//   user,
//   months = 12,
//   alpha = 0.3,
//   beta = 0.1,
// }: {
//   user: any;
//   months?: number;
//   alpha?: number;
//   beta?: number;
// }): Promise<{
//   totalForecast: number;
//   breakdown: {
//     category: Types.ObjectId;
//     categoryName: string;
//     monthlyData?: { month: string; total: number }[];
//     forecastedAmount: number;
//   }[];
// }> {
//   // 1. Fetch all expense categories for the user (default + user's own)
//   const categories = await categoryModel
//     .find({
//       type: TransactionTypeEnum.EXPENSE,
//       deletedAt: null,
//       $or: [{ user }, { isDefault: true, user: null }],
//     })
//     .select('_id name')
//     .lean();

//   const categoryIds = categories.map((c) => c._id);
//   if (categoryIds.length === 0) {
//     return { totalForecast: 0, breakdown: [] };
//   }

//   // 2. Fetch all expense transactions for the user in the last N months
//   const startDate = new Date();
//   startDate.setMonth(startDate.getMonth() - months);

//   const transactions = await transactionModel
//     .find({
//       user,
//       type: TransactionTypeEnum.EXPENSE,
//       category: { $in: categoryIds },
//       date: { $gte: startDate },
//       deletedAt: null,
//     })
//     .select('category amount date')
//     .lean();

//   // 3. Group by category and month (YYYY-MM)
//   const grouped = new Map<
//     string,
//     { month: string; total: number }[]
//   >();

//   transactions.forEach((t) => {
//     const catId = t.category.toString();
//     const monthKey = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
//     if (!grouped.has(catId)) {
//       grouped.set(catId, []);
//     }
//     const arr = grouped.get(catId)!;
//     const existing = arr.find((item) => item.month === monthKey);
//     if (existing) {
//       existing.total += t.amount;
//     } else {
//       arr.push({ month: monthKey, total: t.amount });
//     }
//   });

//   // 4. Build breakdown per category with Holt's forecast
//   const breakdown = categories.map((cat) => {
//     const monthlyData = grouped.get(cat._id.toString()) || [];
//     // Sort by month (oldest first)
//     monthlyData.sort((a, b) => a.month.localeCompare(b.month));
//     const totals = monthlyData.map((m) => m.total);
//     const forecastedAmount = holtLinearTrend(totals, alpha, beta);
//     return {
//       category: cat._id,
//       categoryName: cat.name,
//       monthlyData: monthlyData.length > 0 ? monthlyData : undefined,
//       forecastedAmount,
//     };
//   });

//   // 5. Total forecast
//   const totalForecast = breakdown.reduce((sum, b) => sum + b.forecastedAmount, 0);

//   return { totalForecast, breakdown };
// }

// services/transaction.service.ts

async getCategorySpending({
  user,
  startDate,
  endDate,
}: {
  user: any
  startDate?: Date;
  endDate?: Date;
}): Promise<{ category: { _id: string; name: string; color?: string }; total: number }[]> {
  const filter: any = {
    user,
    type: 'expense',
    deletedAt: null,
  };
  if (startDate) filter.date = { ...filter.date, $gte: startDate };
  if (endDate) filter.date = { ...filter.date, $lte: endDate };

  const pipeline:any = [
    { $match: filter },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
    { $match: { total: { $gt: 0 } } }, // only categories with spending
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $project: {
        category: {
          _id: '$categoryInfo._id',
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
        },
        total: 1,
      },
    },
    { $sort: { total: -1 } },
  ];

  return await transactionModel.aggregate(pipeline);
}

async getExpenseForecast({
  user,
}: {
  user: Types.ObjectId | string | any;
}): Promise<any> {

  /**
   * CURRENT MONTH
   *
   * Example:
   * Today = 09 August 2026
   *
   * currentMonthStart = 01 August 2026
   *
   * We DO NOT use August transactions for forecasting
   * because August is incomplete.
   */
  const now = new Date();

  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  /**
   * Previous month
   *
   * Example:
   * 01 July 2026 -> 01 August 2026
   */
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  /**
   * -------------------------------------
   * 1. GET EXPENSE CATEGORIES
   * -------------------------------------
   *
   * Includes:
   * - user's custom categories
   * - system/default categories
   */
  const categories = await categoryModel
    .find({
      type: TransactionTypeEnum.EXPENSE,
      deletedAt: null,
      $or: [
        { user },
        {
          isDefault: true,
          user: null,
        },
      ],
    })
    .select("_id name icon color")
    .lean();

  if (!categories.length) {
    return {
      forecastMonth: formatMonth(currentMonthStart),
      previousMonth: formatMonth(previousMonthStart),

      totalPreviousMonthExpense: 0,
      totalForecastedExpense: 0,

      categories: [],
    };
  }

  const categoryIds = categories.map(
    (category) => category._id
  );

  /**
   * -------------------------------------
   * 2. GET ALL HISTORICAL EXPENSES
   * -------------------------------------
   *
   * IMPORTANT:
   * date < currentMonthStart
   *
   * This means current month's partial
   * transactions are NOT used for forecasting.
   */
  const transactions = await transactionModel
    .find({
      user,
      type: TransactionTypeEnum.EXPENSE,

      category: {
        $in: categoryIds,
      },

      date: {
        $lt: currentMonthStart,
      },

      deletedAt: null,
    })
    .select("category amount date")
    .sort({ date: 1 })
    .lean();

  /**
   * -------------------------------------
   * 3. GROUP EXPENSES
   * CATEGORY -> MONTH -> TOTAL
   * -------------------------------------
   *
   * Structure:
   *
   * {
   *   foodCategoryId: {
   *      "2026-05": 200,
   *      "2026-06": 250,
   *      "2026-07": 300
   *   }
   * }
   */

  const groupedData = new Map<
    string,
    Map<string, number>
  >();

  for (const transaction of transactions) {

    const categoryId =
      transaction.category.toString();

    const monthKey = getMonthKey(
      transaction.date
    );

    if (!groupedData.has(categoryId)) {
      groupedData.set(
        categoryId,
        new Map<string, number>()
      );
    }

    const categoryMonths =
      groupedData.get(categoryId)!;

    const currentTotal =
      categoryMonths.get(monthKey) || 0;

    categoryMonths.set(
      monthKey,
      currentTotal + transaction.amount
    );
  }

  /**
   * -------------------------------------
   * 4. BUILD CATEGORY FORECAST
   * -------------------------------------
   */

  const categoryForecasts = categories.map(
    (category) => {

      const categoryId =
        category._id.toString();

      const monthlyMap =
        groupedData.get(categoryId) ||
        new Map<string, number>();

      /**
       * Sort monthly data oldest -> newest.
       */
      const monthlyHistory =
        Array.from(monthlyMap.entries())
          .map(([month, amount]) => ({
            month,
            amount: Number(
              amount.toFixed(2)
            ),
          }))
          .sort((a, b) =>
            a.month.localeCompare(b.month)
          );

      /**
       * -----------------------------------
       * IMPORTANT
       * -----------------------------------
       *
       * Fill missing months with 0.
       *
       * Example:
       *
       * May = £200
       * June = no spending
       * July = £300
       *
       * Forecast input should be:
       *
       * [200, 0, 300]
       *
       * NOT:
       *
       * [200, 300]
       */
      const continuousHistory =
        fillMissingMonths(
          monthlyHistory,
          currentMonthStart
        );

      const totals =
        continuousHistory.map(
          (item) => item.amount
        );

      /**
       * Select algorithm automatically.
       */
      const forecastResult =
        forecastExpense(totals);

      /**
       * Previous month spending
       */
      const previousMonthKey =
        getMonthKey(previousMonthStart);

      const previousMonthExpense =
        monthlyMap.get(previousMonthKey) || 0;

      return {
        category: category._id,

        categoryName: category.name,

        icon: category.icon,

        color: category.color,

        previousMonthExpense:
          Number(
            previousMonthExpense.toFixed(2)
          ),

        forecastedAmount:
          forecastResult.forecast,

        forecastingMethod:
          forecastResult.method,

        historicalMonths:
          totals.length,

        monthlyHistory:
          continuousHistory,
      };
    }
  );

  /**
   * -------------------------------------
   * 5. TOTAL PREVIOUS MONTH EXPENSE
   * -------------------------------------
   */

  const totalPreviousMonthExpense =
    categoryForecasts.reduce(
      (sum, category) =>
        sum +
        category.previousMonthExpense,
      0
    );

  /**
   * -------------------------------------
   * 6. TOTAL FORECAST
   * -------------------------------------
   */

  const totalForecastedExpense =
    categoryForecasts.reduce(
      (sum, category) => {

        if (
          category.forecastedAmount === null
        ) {
          return sum;
        }

        return (
          sum +
          category.forecastedAmount
        );
      },
      0
    );

  /**
   * -------------------------------------
   * 7. RESPONSE
   * -------------------------------------
   */

  return {
    previousMonth:
      formatMonth(previousMonthStart),

    forecastMonth:
      formatMonth(currentMonthStart),

    totalPreviousMonthExpense:
      Number(
        totalPreviousMonthExpense.toFixed(2)
      ),

    totalForecastedExpense:
      Number(
        totalForecastedExpense.toFixed(2)
      ),

    categories:
      categoryForecasts,
  };
}


}
 