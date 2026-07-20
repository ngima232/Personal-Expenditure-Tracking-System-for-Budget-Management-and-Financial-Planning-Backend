import slug from "slug";
import {
  InputLoanInterface,
  LoanInterface,
  ArgsLoanInterface,
  PaginationMetadata,
} from "../interfaces";
import { loanModel } from "../models";
import { LoanStatusEnum } from "../enums";
 
export class LoanService {

  async create(input: InputLoanInterface): Promise<LoanInterface> {
     const inputSlug = slug(`${input.personName}-${input.amount}-${input.date}`);
        const dataExists = await loanModel.findOne({
          slug: inputSlug,
          user: input.user,
          type: input.type,
          deletedAt: null,
        });
        if (dataExists) {
          throw new Error(`This data is already exists!`);
        }
        input.slug = inputSlug;
    const data = await loanModel.create(input);
    return data;
  }
 
  async update(
    id: string,
    updates: Partial<InputLoanInterface>
  ): Promise<LoanInterface | null> {
    const dataExists = await loanModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (dataExists) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const updatedData = await loanModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedData) throw new Error(`Failed to update id : ${id} `);
    return updatedData;
  }
 
  async updateStatus(
    id: string,
    status: LoanStatusEnum
  ): Promise<LoanInterface | null> {
    const dataExists = await loanModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (dataExists) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const updatedData = await loanModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedData) throw new Error(`Failed to update status for id : ${id} `);
    return updatedData;
  }
 
  async delete(id: string): Promise<any> {
    const deletedData = await loanModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (deletedData) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }
 
    const deleted = await loanModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return deleted;
  }
 
  async getMyLoans({
    page,
    limit,
    query,
    sort,
    order,
    type,
    status,
    user,
  }: ArgsLoanInterface): Promise<{
    metadata?: PaginationMetadata;
    data: { count?: number; rows: LoanInterface[] };
  }> {
    try {
      if (isNaN(page) || isNaN(limit)) {
        throw new Error("Invalid page or limit");
      }
 
      const skip = Math.max(page - 1, 0) * limit;
 
      const filter: any = {
        deletedAt: null,
        user,
      };
 
      if (query) {
        filter.personName = {
          $regex: query,
          $options: "i",
        };
      }
 
      if (type) {
        filter.type = type;
      }
 
      if (status) {
        filter.status = status;
      }
 
      const sortField = sort || "createdAt";
      const sortOrder = order === "asc" ? 1 : -1;
      const count = await loanModel.countDocuments(filter);
 
      const data = await loanModel
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
}
 