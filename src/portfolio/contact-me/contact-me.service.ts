import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto.js';

@Injectable()
export class ContactMeService {
  constructor(
    @InjectModel(Message.name)
    private readonly contactMeModel: Model<MessageDocument>,
  ) {}

  async create(dto: CreateMessageDto): Promise<MessageDocument> {
    try {
      return await this.contactMeModel.create(dto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  }

  async getAll(): Promise<MessageDocument[]> {
    try {
      return await this.contactMeModel.find().exec();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  }

  async getById(id: string): Promise<MessageDocument> {
    try {
      const message = await this.contactMeModel.findById(id).exec();

      if (!message) {
        throw new NotFoundException(`Message with ID '${id}' not found.`);
      }

      return message;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  }

  async updateReadStatus(
    id: string,
    isRead: boolean,
  ): Promise<MessageDocument> {
    const updatedMessage = await this.contactMeModel
      .findByIdAndUpdate(id, { isRead }, { new: true, runValidators: true })
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }

    return updatedMessage;
  }

  async updateRepliedStatus(
    id: string,
    replied: boolean,
  ): Promise<MessageDocument> {
    const updatedMessage = await this.contactMeModel
      .findByIdAndUpdate(
        id,
        { replied },
        { returnDocument: 'after', runValidators: true },
      )
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }

    return updatedMessage;
  }

  async remove(id: string): Promise<MessageDocument> {
    const deletedMessage = await this.contactMeModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }

    return deletedMessage;
  }

  async updateArchiveStatus(
    id: string,
    isArchived: boolean,
  ): Promise<MessageDocument> {
    const updatedMessage = await this.contactMeModel
      .findByIdAndUpdate(id, { isArchived }, { new: true, runValidators: true })
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }

    return updatedMessage;
  }

  async updateAdminNote(
    id: string,
    adminNotes: string,
  ): Promise<MessageDocument> {
    const updatedMessage = await this.contactMeModel
      .findByIdAndUpdate(id, { adminNotes }, { new: true, runValidators: true })
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }

    return updatedMessage;
  }
}
