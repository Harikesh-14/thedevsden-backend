import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schema/note.schema.js';
import { NotepadService } from './nodepad.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema }
    ])
  ],
  providers: [NotepadService],
  exports: [NotepadService]
})
export class NotepadModule { }
