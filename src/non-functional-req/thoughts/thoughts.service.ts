import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thoughts, ThoughtsDocument } from './schemas/thoughts.schema.js';
import { CreateThoughtsDto } from './dto/create-thoughts.dto.js';

/**
 * Service responsible for managing thought entities and their database operations.
 */
@Injectable()
export class ThoughtsService {
  /**
   * Creates an instance of `ThoughtsService`.
   * 
   * @param thoughtModel - The Mongoose model injected for the `Thoughts` collection.
   */
  constructor(
    @InjectModel(Thoughts.name)
    private readonly thoughtModel: Model<ThoughtsDocument>,
  ) {}

  /**
   * Persists a new thought document to the database with a UTC-normalized display date.
   *
   * @param dto - Data transfer object containing the thought details.
   * @returns A promise that resolves to the newly created {@link Thoughts} document.
   * 
   * @example
   * const newThought = await thoughtsService.create({
   *   content: 'Hello World',
   *   displayDate: '2026-09-25'
   * });
   */
  async create(dto: CreateThoughtsDto): Promise<Thoughts> {
    const normalizeDate = new Date(dto.displayDate);
    normalizeDate.setUTCHours(0, 0, 0, 0);

    const newThought = new this.thoughtModel({
      ...dto,
      displayDate: normalizeDate,
    });

    return newThought.save();
  }

  /**
   * Retrieves a thought corresponding to a specific normalized display date.
   *
   * @param dateStr - An ISO date string or date representation (e.g., `'2026-09-25'`).
   * @returns A promise that resolves to the matching {@link Thoughts} document.
   * 
   * @throws {@link NotFoundException}
   * Thrown when no thought entry exists for the specified date.
   */
  async findByDisplayDate(dateStr: string): Promise<Thoughts> {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    const thought = await this.thoughtModel
      .findOne({
        displayDate: targetDate,
      })
      .exec();

    if (!thought) {
      throw new NotFoundException(`No thought found for date: ${dateStr}`);
    }

    return thought;
  }

  /**
   * Retrieves today's thought, falling back to the most recently published thought if today's is unavailable.
   *
   * @returns A promise that resolves to today's or the latest published {@link Thoughts} document.
   * 
   * @throws {@link NotFoundException}
   * Thrown when no thoughts match the criteria or no published thoughts exist.
   */
  async getTodatOrLatest(): Promise<Thoughts> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let thought = await this.thoughtModel
      .findOne({
        displayDate: today,
      })
      .exec();

    if (!thought) {
      thought = await this.thoughtModel
        .findOne({ isPublished: true })
        .sort({ displayDate: -1 })
        .exec();
    }

    if (!thought) {
      throw new NotFoundException('No thoughts available');
    }

    return thought;
  }
}