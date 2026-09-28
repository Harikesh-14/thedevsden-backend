import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ThoughtsService } from './thoughts.service.js';
import { CreateThoughtsDto } from './dto/create-thoughts.dto.js';

@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtsService: ThoughtsService) {}

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
}
