import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema.js';
import { BlogsService } from './blogs.service.js';
import { BlogsController } from './blogs.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema }
    ])
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService]
})
export class YapperyModule {}
