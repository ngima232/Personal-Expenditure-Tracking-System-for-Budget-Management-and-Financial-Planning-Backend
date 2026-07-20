import slug from "slug";
import { MongooseQueryGenerator } from "../helpers";
import {
  InputInvestmentInterface,
  InvestmentInterface,
  ArgsInvestmentInterface,
  PaginationMetadata,
} from "../interfaces";
import { investmentModel } from "../models";

export class InvestmentService {
  async create(input: InputInvestmentInterface): Promise<InvestmentInterface> {
    const inputSlug = slug(input.name);
    const dataExists = await investmentModel.findOne({
      slug: inputSlug,
      user: input.user,
      type: input.type,
      deletedAt: null,
    });
    if (dataExists) {
      throw new Error(`Investment "${input.name}" already exists for this user and type.`);
    }
    input.slug = inputSlug;
    const data = await investmentModel.create(input);
    return data;
  }

  async update(
    id: string,
    updates: Partial<InputInvestmentInterface>
  ): Promise<InvestmentInterface | null> {

    const existing = await investmentModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (existing) {
      throw new Error(`Investment with id ${id} is already deleted or not found.`);
    }

    if (updates.name) {
      const newSlug = slug(updates.name);

      const conflict = await investmentModel.findOne({
        _id: { $ne: id },
        slug: newSlug,
        user: updates.user,
        type: updates.type ,
        deletedAt: null,
      });
      if (conflict) {
        throw new Error(`Investment "${updates.name}" already exists.`);
      }
      updates.slug = newSlug;
    }

    const updatedData = await investmentModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedData) throw new Error(`Failed to update investment with id ${id}`);
    return updatedData;
  }

  async delete(id: string): Promise<InvestmentInterface | null> {
    const existing = await investmentModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (existing) {
      throw new Error(`Investment with id ${id} is already deleted or not found.`);
    }

    const deleted = await investmentModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return deleted;
  }

  async getMyInvestments({
    page,
    limit,
    query,
    sort,
    order,
    type,
    user,
    startDate,
    endDate,
  }: ArgsInvestmentInterface): Promise<{
    metadata?: PaginationMetadata;
    data: { count?: number; rows: InvestmentInterface[] };
  }> {
    if (isNaN(page) || isNaN(limit)) {
      throw new Error("Invalid page or limit");
    }

    const skip = Math.max(page - 1, 0) * limit;

    const filter: any = {
      deletedAt: null,
      user: user, 
    };

    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const sortField = sort || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const count = await investmentModel.countDocuments(filter);

    const rows = await investmentModel
      .find(filter)
      .select("-deletedAt")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const metadata: PaginationMetadata = {
      previousPage: page > 1 ? page - 1 : null,
      currentPage: page,
      nextPage: skip + rows.length < count ? page + 1 : null,
      perPage: limit,
    };

    return {
      metadata,
      data: { count, rows },
    };
  }
}