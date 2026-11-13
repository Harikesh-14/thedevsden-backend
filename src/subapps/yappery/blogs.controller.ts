import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogsService } from './blogs.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }

  /**
   * POST /blogs
   * Create a new blog post
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  /**
   * GET /blogs
   * Get all blogs with optional filtering, search, sorting, and pagination
   * Example: /blogs?page=1&limit=10&sortBy=most-viewed&tag=nestjs
   */
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('onlyPublished') onlyPublished?: string,
    @Query('sortBy') sortBy?: 'newest' | 'oldest' | 'most-viewed',
  ) {
    const options = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      tag,
      search,
      onlyPublished: onlyPublished !== 'false',
      sortBy,
    };

    return this.blogsService.findAll(options);
  }

  /**
   * GET /blogs/:slug
   * Get a single blog by its URL slug (automatically increments view count)
   */
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  /**
   * POST /blogs/:slug/view
   * Explicitly increment the view count for a blog post
   */
  @Post(':slug/view')
  @HttpCode(HttpStatus.OK)
  async incrementViews(@Param('slug') slug: string) {
    return this.blogsService.incrementViews(slug);
  }

  /**
   * PATCH /blogs/:id
   * Update an existing blog post by its MongoDB ObjectId
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  /**
   * DELETE /blogs/:id
   * Delete a blog post by its MongoDB ObjectId
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}