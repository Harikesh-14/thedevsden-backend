import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema.js';
import { ContactMeService } from './contact-me.service.js';
import { ContactMeController } from './contact-me.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Message.name, schema: MessageSchema}
    ])
  ],
  providers: [ContactMeService],
  controllers: [ContactMeController]
})
export class ContactMeModule {}
