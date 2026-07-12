import slug from "slug";
import { MongooseQueryGenerator } from "../helpers";
import {
  InputeCategoryInterface,
  CategoryInterface,
  ArgsCategoryInterface,
  PaginationMetadata,
} from "../interfaces";
import { categoryModel } from "../models";


export class CategoryService {

  async create(
    input: InputeCategoryInterface
  ): Promise<CategoryInterface> {
    const inputSlug = slug(input.name);
    const dataExists = await categoryModel.findOne({
      slug: inputSlug,
      user: input.user,
      type: input.type,
      deletedAt: null,
    });
    if (dataExists) {
      throw new Error(`${input.name} is already exists!`);
    }
    input.slug = inputSlug;
    const data = await categoryModel.create(input);
    return data;
  }

  async update(
    id: string,
    updates: Partial<InputeCategoryInterface>
  ): Promise<CategoryInterface | null> {
    const dataExists = await categoryModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (dataExists) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }

    if (updates.name) {
      const updateSlug = slug(updates.name);
      const dataExists = await categoryModel.findOne({
        _id: { $ne: id },
        slug: updateSlug,
        user: updates.user,
        type: updates.type,
        deletedAt: null,
      });

      if (dataExists) {
        throw new Error(`${updates.name} is already exists!`);
      }
      updates.slug = updateSlug;
    }
    const updatedData = await categoryModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedData) throw new Error(`Failed to update id : ${id} `);
    return updatedData;
  }

  async delete(id: string): Promise<any> {
    const deletedData = await categoryModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (deletedData) {
      throw new Error(`Given id: ${id} is not found or already deleted`);
    }

    const deleted = await categoryModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return deleted;
  }

  async getMyCategory({
  page,
  limit,
  query,
  sort,
  order,
  type,
  user,
}: ArgsCategoryInterface): Promise<{
  metadata?: PaginationMetadata;
  data: { count?: number; rows: CategoryInterface[] };
}> {
  try {
    if (isNaN(page) || isNaN(limit)) {
      throw new Error("Invalid page or limit");
    }

    const skip = Math.max(page - 1, 0) * limit;

    const filter: any = {
      deletedAt: null,
      $or: [
        { user }, // User's own categories
        {
          isDefault: true,
          user: null, // Default categories
        },
      ],
    };

    if (query) {
      filter.name = {
        $regex: query,
        $options: "i",
      };
    }

    if (type) {
      filter.type = type;
    }

    const sortField = sort || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const count = await categoryModel.countDocuments(filter);

    const data = await categoryModel
      .find(filter)
      .select("-deletedAt")
      // .populate({
      //   path: "user",
      //   select: "_id name email image",
      //   match: { deletedAt: null },
      // })
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
