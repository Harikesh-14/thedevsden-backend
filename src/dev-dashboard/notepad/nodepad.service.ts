import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Note, NoteDocument } from "./schema/note.schema.js";
import { CreateNoteDto } from "./dto/create-note.dto.js";
import { UpdateNoteDto } from "./dto/update-note.dto.js";

@Injectable()
export class NotepadService {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: Model<Note>,
  ) { }

  async create(createNoteDto: CreateNoteDto): Promise<NoteDocument> {
    const note = new this.noteModel(createNoteDto);
    return note.save();
  }

  async findAll(): Promise<NoteDocument[]> {
    return this.noteModel
      .find()
      .sort({ pinned: -1, updatedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }

    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    const note = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, {
        returnDocument: "after",
        runValidators: true,
      })
      .exec();

    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }

    return note;
  }

  async remove(id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findByIdAndDelete(id).exec();

    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }

    return note;
  }
}
