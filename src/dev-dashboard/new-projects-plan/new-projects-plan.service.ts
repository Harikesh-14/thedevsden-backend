import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NewProjectsPlan, NewProjectsPlanDocument } from './schemas/new-projects-plan.schema.js';
import { Model } from 'mongoose'
import { CreateNewProjectsPlanDto } from './dto/create-new-projects-plan.dto.js';
import { UpdateNewProjectsPlanDto } from './dto/update-new-projects-plan.dto.js';

/**
* Service responsible for managing thought entities and their database operations.
*/
@Injectable()
export class NewProjectsPlanService {
  /**
  * Creates an instance of `NewProjectsPlanService`.
  * 
  * @param newProjectPlansModel - The Mongoose model injected for the `NewProjectsPlan` collection.
  */
  constructor(
    @InjectModel(NewProjectsPlan.name)
    private readonly newProjectPlansModel: Model<NewProjectsPlanDocument>
  ) { }

  /**
  * Persists a new project plan document to the database.
  *
  * @param dto - Data transfer object containing the project plan details.
  * @returns A promise that resolves to the newly created {@link NewProjectsPlan} document.
  * 
  * @example
  * const newProjectsPlan = await newProjectsPlanService.create({
  *   title: 'This is the title',
  *   content: 'The content in the .md format',
  *   skills: {
  *      frontend: ['NextJS'],
  *      backend: ['NestJS'],
  *      database: ['Mongoose']
  *   }
  * });
  */
  async create(dto: CreateNewProjectsPlanDto): Promise<NewProjectsPlanDocument> {
    try {
      return await this.newProjectPlansModel.create(dto)
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException(`A project plan with this title already exists.`)
      }

      throw error
    }
  }

  /**
   * Retrieves all new project plans from the database.
   *
   * @returns A promise that resolves to an array of {@link NewProjectsPlanDocument} instances.
   */
  async getAll(): Promise<NewProjectsPlanDocument[]> {
    return this.newProjectPlansModel.find().exec();
  }

  /**
   * Retrieves a single new project plan by its unique database ID.
   *
   * @param id - The unique MongoDB ObjectId string of the project plan.
   * @returns A promise that resolves to the found {@link NewProjectsPlanDocument}, or `null` if no match exists.
   */
  async getById(id: string): Promise<NewProjectsPlanDocument | null> {
    try {
      const projectPlan = await this.newProjectPlansModel
        .findById(id)
        .exec()

      if (!projectPlan) {
        throw new NotFoundException(`Project plan with ID '${id}' was not found.`)
      }

      return projectPlan
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid project plan ID.`)
      }

      throw error;
    }
  }

  /**
  * Updates an existing project plan document via mongoose document `_id`.
  * 
  * @param id - Mongoose document `_id`.
  * @param dto - Data transfer object containing the new project plan details.
  * 
  * @returns A promise that resolves to the newly updated {@link NewProjectsPlan} document or null value.
  */
  async update(id: string, dto: UpdateNewProjectsPlanDto): Promise<NewProjectsPlanDocument> {
    try {
      const projectPlan = await this.newProjectPlansModel
        .findByIdAndUpdate(
          id,
          dto,
          {
            returnDocument: 'after',
            runValidators: true,
          },
        )
        .exec()

      if (!projectPlan) {
        throw new NotFoundException(
          `Project plan with ID '${id}' was not found.`,
        )
      }

      return projectPlan
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          'A project plan with this title already exists.',
        )
      }

      throw error
    }
  }

  /**
  * Deletes an existing project plan document by its Mongoose `_id`.
  *
  * @param id Mongoose document `_id`.
  * @returns A promise that resolves to the deleted {@link NewProjectsPlan} document,
  * or `null` if no document was found.
  */
  async deleteById(id: string): Promise<NewProjectsPlanDocument> {
    const projectPlan = await this.newProjectPlansModel
      .findByIdAndDelete(id)
      .exec()

    if (!projectPlan) {
      throw new NotFoundException(
        `Project plan with ID '${id}' was not found.`,
      )
    }

    return projectPlan
  }
}
