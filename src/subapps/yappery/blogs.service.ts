import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schema/blog.schema.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { Category, CategoryDocument } from './schema/category.schema.js';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) { }

  /**
   * Create a new blog post
   */
  async create(createBlogDto: CreateBlogDto): Promise<BlogDocument> {
    const categoryExists = await this.categoryModel.exists({
      _id: createBlogDto.category,
    });

    if (!categoryExists) {
      throw new NotFoundException(
        `Category with ID "${createBlogDto.category}" not found`,
      );
    }

    const slug = await this.generateUniqueSlug(createBlogDto.title);
    const readingTime = this.calculateReadingTime(createBlogDto.content);

    const excerpt =
      createBlogDto.excerpt || this.generateExcerpt(createBlogDto.content);

    const newBlog = new this.blogModel({
      ...createBlogDto,
      slug,
      readingTime,
      excerpt,
      publishedAt: createBlogDto.isPublished ? new Date() : undefined,
    });

    return newBlog.save();
  }

  /**
   * Get all blogs (with optional filtering & pagination)
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    tag?: string;
    category?: string;
    search?: string;
    onlyPublished?: boolean;
    sortBy?: 'newest' | 'oldest' | 'most-viewed';
  }): Promise<{
    data: BlogDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options?.onlyPublished !== false) {
      filter.isPublished = true;
    }

    // Filter by tag
    if (options?.tag) {
      filter.tags = options.tag;
    }

    // Filter by category ID
    if (options?.category) {
      if (!Types.ObjectId.isValid(options.category)) {
        throw new BadRequestException('Invalid category ID');
      }

      filter.category = new Types.ObjectId(options.category);
    }

    // Search blogs
    if (options?.search) {
      filter.$text = { $search: options.search };
    }

    // Sorting
    let sortQuery: Record<string, 1 | -1> = {
      publishedAt: -1,
      createdAt: -1,
    };

    if (options?.sortBy === 'oldest') {
      sortQuery = {
        publishedAt: 1,
        createdAt: 1,
      };
    } else if (options?.sortBy === 'most-viewed') {
      sortQuery = {
        viewsCount: -1,
        publishedAt: -1,
      };
    }

    const [data, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .populate('category')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .exec(),

      this.blogModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single blog by slug (without auto-incrementing views)
   */
  async findBySlug(slug: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOne({ slug })
      .populate('category')
      .exec();

    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }

    return blog;
  }

  /**
   * Explicitly increment the view count for a blog post
   */
  async incrementViews(slug: string): Promise<{ viewsCount: number }> {
    const blog = await this.blogModel
      .findOneAndUpdate(
        { slug },
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after", select: 'viewsCount' },
      )
      .exec();

    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }

    return { viewsCount: blog.viewsCount };
  }

  /**
   * Update an existing blog
   */
  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogDocument> {
    const existingBlog = await this.blogModel.findById(id).exec();
    if (!existingBlog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }

    const updatePayload: Record<string, any> = { ...updateBlogDto };

    if (updateBlogDto.category) {
      const categoryExists = await this.categoryModel.exists({
        _id: updateBlogDto.category,
      });

      if (!categoryExists) {
        throw new NotFoundException(
          `Category with ID "${updateBlogDto.category}" not found`,
        );
      }
    }

    // Regenerate slug if title changed
    if (updateBlogDto.title && updateBlogDto.title !== existingBlog.title) {
      updatePayload.slug = await this.generateUniqueSlug(updateBlogDto.title, id);
    }

    // Recalculate reading time if content changed
    if (updateBlogDto.content) {
      updatePayload.readingTime = this.calculateReadingTime(updateBlogDto.content);
    }

    // Set publishedAt timestamp the first time it gets published
    if (updateBlogDto.isPublished && !existingBlog.isPublished && !existingBlog.publishedAt) {
      updatePayload.publishedAt = new Date();
    }

    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      })
      .populate('category')
      .exec();

    return updatedBlog!;
  }

  /**
   * Delete a blog by ID
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.blogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return { deleted: true };
  }

  /**
   * Fetch all unique tags from published blogs
   */
  async fetchTags(): Promise<string[]> {
    const tags = await this.blogModel.distinct('tags', {
      isPublished: true,
    }).exec();

    return tags.sort((a, b) => a.localeCompare(b));
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Generates a URL-safe slug and ensures uniqueness in MongoDB
   */
  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const query: Record<string, any> = { slug };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const exists = await this.blogModel.exists(query);
      if (!exists) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Strips Markdown formatting and estimates reading time (200 WPM)
   */
  private calculateReadingTime(markdown: string): number {
    const plainText = this.stripMarkdown(markdown);
    const words = plainText.split(/\s+/).filter((word) => word.length > 0).length;
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  /**
   * Creates a clean plain-text excerpt if none was provided
   */
  private generateExcerpt(markdown: string, maxLength = 150): string {
    const plainText = this.stripMarkdown(markdown);
    if (plainText.length <= maxLength) {
      return plainText;
    }
    return plainText.slice(0, maxLength).trim() + '...';
  }

  /**
   * Basic regex sanitizer to extract readable text from Markdown
   */
  private stripMarkdown(markdown: string): string {
    return markdown
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code ticks
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Keep link text, remove URL
      .replace(/[#>*_~-]+/g, '') // Remove markdown symbols
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();
  }
}