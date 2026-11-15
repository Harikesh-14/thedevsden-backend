import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  // CREATE CATEGORY
  async create(createCategoryDto: CreateCategoryDto) {
    const { slug } = createCategoryDto;

    const existingCategory = await this.categoryModel.findOne({ slug });

    if (existingCategory) {
      throw new ConflictException(
        'A category with this slug already exists.',
      );
    }

    try {
      const category = new this.categoryModel(createCategoryDto);
      return await category.save();
    } catch (error) {
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException(
          'A category with this slug already exists.',
        );
      }

      throw error;
    }
  }

  // GET ALL CATEGORIES
  async findAll() {
    return this.categoryModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET CATEGORY BY ID
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID');
    }

    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // UPDATE CATEGORY
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID');
    }

    const existingCategory = await this.categoryModel.findById(id);

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.slug) {
      const duplicateSlug = await this.categoryModel.findOne({
        slug: updateCategoryDto.slug,
        _id: { $ne: id },
      });

      if (duplicateSlug) {
        throw new ConflictException(
          'A category with this slug already exists.',
        );
      }
    }

    try {
      const category = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      return category;
    } catch (error) {
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException(
          'A category with this slug already exists.',
        );
      }

      throw error;
    }
  }

  // DELETE CATEGORY
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID');
    }

    const category = await this.categoryModel
      .findByIdAndDelete(id)
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category deleted successfully',
      id: category._id,
    };
  }
}