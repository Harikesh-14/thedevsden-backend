import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Thoughts, ThoughtsDocument } from './schemas/thoughts.schema.js';
import { Model } from 'mongoose'
import { CreateThoughtsDto } from './dto/create-thoughts.dto.js';

@Injectable()
export class ThoughtsService {
  constructor(
    @InjectModel(Thoughts.name)
    private readonly thoughtModel: Model<ThoughtsDocument>,
  ) {}

  async create(dto: CreateThoughtsDto): Promise<Thoughts> {
    const normalizeDate = new Date(dto.displayDate);
    normalizeDate.setUTCHours(0, 0, 0, 0);

    const newThought = new this.thoughtModel({
      ...dto,
      displayDate: normalizeDate
    });

    return newThought.save();
  }

  async findByDisplayDate(dateStr: string): Promise<Thoughts> {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    const thought = await this.thoughtModel.findOne({
      displayDate: targetDate,
    }).exec();

    if (!thought) {
      throw new NotFoundException(`No thought found for date: ${dateStr}`)
    }

    return thought;
  }

  async getTodatOrLatest(): Promise<Thoughts> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let thought = await this.thoughtModel.findOne({
      displayDate: today,
    }).exec();

    if (!thought) {
      thought = await this.thoughtModel.findOne({ isPublished: true })
        .sort({ displayDate: -1 })
        .exec();
    }

    if (!thought) {
      throw new NotFoundException('No thoughts available');
    }

    return thought;
  }
}
