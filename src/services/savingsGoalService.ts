import slug from "slug";
import {
  InputSavingsGoalInterface,
  SavingsGoalInterface,
  ArgsSavingsGoalInterface,
  PaginationMetadata,
} from "../interfaces";
import { savingsGoalModel } from "../models";
import { SavingsGoalStatusEnum } from "../enums";
 
export class SavingsGoalService {
 
  async create(
    input: InputSavingsGoalInterface
  ): Promise<SavingsGoalInterface> {

     const inputSlug = slug(input.title);

        const dataExists = await savingsGoalModel.findOne({
          slug: inputSlug,
          user: input.user,
          targetAmount: input.targetAmount,
          targetDate: input.targetDate,
          deletedAt: null,
        });
        if (dataExists) {
          throw new Error(`${input.title} is already exists!`);
        }
        input.slug = inputSlug;
    const data = await savingsGoalModel.create(input);
    return data;
  }
 
  async update(
    id: string,
    updates: Partial<InputSavingsGoalInterface>
  ): Promise<SavingsGoalInterface | null> {
    const dataExists = await savingsGoalModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (dataExists) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }

     if (updates.title) {
          const updateSlug = slug(updates.title);
          const dataExists = await savingsGoalModel.findOne({
            _id: { $ne: id },
            slug: updateSlug,
            user: updates.user,
            targetAmount: updates.targetAmount,
            targetDate: updates.targetDate,
            deletedAt: null,
          });
    
          if (dataExists) {
            throw new Error(`${updates.title} is already exists!`);
          }
          updates.slug = updateSlug;
        }
 
    const updatedData = await savingsGoalModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedData) throw new Error(`Failed to update id : ${id} `);
    return updatedData;
  }
 
  async delete(id: string): Promise<any> {
    const deletedData = await savingsGoalModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (deletedData) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const deleted = await savingsGoalModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return deleted;
  }
 
  async getMyGoals({
    page,
    limit,
    query,
    sort,
    order,
    status,
    user,
  }: ArgsSavingsGoalInterface): Promise<{
    metadata?: PaginationMetadata;
    data: { count?: number; rows: SavingsGoalInterface[] };
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
        filter.title = {
          $regex: query,
          $options: "i",
        };
      }
 
      if (status) filter.status = status;
 
      const sortField = sort || "createdAt";
      const sortOrder = order === "asc" ? 1 : -1;
      const count = await savingsGoalModel.countDocuments(filter);
 
      const data = await savingsGoalModel
        .find(filter)
        .select("-deletedAt")
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
 
  // Adds a contribution, bumps currentAmount, and auto-completes the goal if the target is reached
  async addContribution(
    id: string,
    contribution: { amount: number; date?: any; note?: string }
  ): Promise<SavingsGoalInterface> {
    const goal = await savingsGoalModel.findOne({ _id: id, deletedAt: null });
    if (!goal) {
      throw new Error(`Given id: ${id} is not found`);
    }
 
    goal.contributions.push({
      amount: contribution.amount,
      note: contribution.note,
      date: contribution.date ? contribution.date :new Date(),
    });
    goal.currentAmount = (goal.currentAmount || 0) + contribution.amount;
 
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = SavingsGoalStatusEnum.COMPLETED;
    }
 
    await goal.save();
    return goal;
  }
}
 