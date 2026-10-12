import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ThoughtsService } from './thoughts.service.js';
import { CreateThoughtsDto } from './dto/create-thoughts.dto.js';

@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtsService: ThoughtsService) { }

  @Post()
  create(@Body() createThoughtDto: CreateThoughtsDto) {
    return this.thoughtsService.create(createThoughtDto);
  }

  @Get('/today')
  getToday() {
    return this.thoughtsService.getTodatOrLatest();
  }

  @Get('/date/:date')
  getByDate(@Param('date') date: string) {
    return this.thoughtsService.findByDisplayDate(date);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateThoughtsDto>) {
    return this.thoughtsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thoughtsService.remove(id);
  }
}
