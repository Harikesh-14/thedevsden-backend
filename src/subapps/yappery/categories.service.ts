import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema.js';
import { Blog, BlogDocument } from './schema/blog.schema.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}

  // CREATE CATEGORY
  async create(createCategoryDto: CreateCategoryDto) {
    const { blog, ...categoryData } = createCategoryDto;

    const existingBlog = await this.blogModel.findById(blog);

    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    const category = new this.categoryModel({
      ...categoryData,
      blog: new Types.ObjectId(blog),
    });

    return category.save();
  }

  // GET ALL CATEGORIES
  async findAll(blogId?: string) {
    const filter: Record<string, unknown> = {};

    if (blogId) {
      if (!Types.ObjectId.isValid(blogId)) {
        throw new BadRequestException('Invalid blog ID');
      }

      filter.blog = new Types.ObjectId(blogId);
    }

    return this.categoryModel
      .find(filter)
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET CATEGORY BY ID
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID');
    }

    const category = await this.categoryModel
      .findById(id)
      .populate('blog', 'title slug')
      .exec();

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

    const { blog, ...categoryData } = updateCategoryDto;

    if (blog) {
      if (!Types.ObjectId.isValid(blog)) {
        throw new BadRequestException('Invalid blog ID');
      }

      const existingBlog = await this.blogModel.findById(blog);

      if (!existingBlog) {
        throw new NotFoundException('Blog not found');
      }
    }

    const updateData = {
      ...categoryData,
      ...(blog && { blog: new Types.ObjectId(blog) }),
    };

    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate('blog', 'title slug')
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
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