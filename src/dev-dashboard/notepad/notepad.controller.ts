
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { NotepadService } from "./nodepad.service.js";
import { CreateNoteDto } from "./dto/create-note.dto.js";
import { UpdateNoteDto } from "./dto/update-note.dto.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";

@UseGuards(JwtAuthGuard)
@Controller("notepad")
export class NotepadController {
  constructor(
    private readonly notepadService: NotepadService,
  ) { }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notepadService.create(createNoteDto);
  }

  @Get()
  findAll() {
    return this.notepadService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.notepadService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notepadService.update(id, updateNoteDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.notepadService.remove(id);
  }
}