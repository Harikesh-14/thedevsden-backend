import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema.js';
import { BlogsService } from './blogs.service.js';
import { BlogsController } from './blogs.controller.js';
import { Category, CategorySchema } from './schema/category.schema.js';
import { CategoryController } from './categories.controller.js';
import { CategoryService } from './categories.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Category.name, schema: CategorySchema }
    ])
  ],
  controllers: [BlogsController, CategoryController],
  providers: [BlogsService, CategoryService],
  exports: [BlogsService, CategoryService]
})
export class YapperyModule {}
