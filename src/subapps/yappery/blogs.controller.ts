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
  constructor(private readonly blogsService: BlogsService) {}

  // Create a blog
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
    return this.blogsService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      tag,
      search,
      onlyPublished: onlyPublished !== 'false',
      sortBy,
    });
  }

  // Get a blog by slug
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  // Increment blog views
  @Post(':slug/view')
  @HttpCode(HttpStatus.OK)
  async incrementViews(@Param('slug') slug: string) {
    return this.blogsService.incrementViews(slug);
  }

  // Update a blog
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  // Delete a blog
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
