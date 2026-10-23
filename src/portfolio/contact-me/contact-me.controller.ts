import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ContactMeService } from './contact-me.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('contact-me')
export class ContactMeController {
  constructor(private readonly contactMeService: ContactMeService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.contactMeService.create(dto);
  }

  @Get()
  getAll() {
    return this.contactMeService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.contactMeService.getById(id);
  }

  @Patch(':id/read')
  updateReadStatus(@Param('id') id: string, @Body('isRead') isRead: boolean) {
    return this.contactMeService.updateReadStatus(id, isRead);
  }

  @Patch(':id/replied')
  updateRepliedStatus(
    @Param('id') id: string,
    @Body('replied') replied: boolean,
  ) {
    return this.contactMeService.updateRepliedStatus(id, replied);
  }

  @Patch(':id/archive')
  updateArchiveStatus(
    @Param('id') id: string,
    @Body('isArchived') isArchived: boolean,
  ) {
    return this.contactMeService.updateArchiveStatus(id, isArchived);
  }

  @Patch(':id/notes')
  updateAdminNote(
    @Param('id') id: string,
    @Body('adminNotes') adminNotes: string,
  ) {
    return this.contactMeService.updateAdminNote(id, adminNotes);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactMeService.remove(id);
  }
}
