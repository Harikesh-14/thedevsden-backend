import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NewProjectsPlan, NewProjectsPlanDocument } from './schemas/new-projects-plan.schema.js';
import { Model } from 'mongoose'
import { CreateNewProjectsPlanDto } from './dto/create-new-projects-plan.dto.js';

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
    return this.newProjectPlansModel.create(dto)
  }

  /**
  * Updates an existing project plan document via mongoose document `_id`.
  * 
  * @param id - Mongoose document `_id`.
  * @param dto - Data transfer object containing the new project plan details.
  * 
  * @returns A promise that resolves to the newly updated {@link NewProjectsPlan} document or null value.
  */
  async updateById(id: string, dto: CreateNewProjectsPlanDto): Promise<NewProjectsPlanDocument | null> {
    return this.newProjectPlansModel.findByIdAndUpdate(id, dto, { returnDocument: 'after' })
  }

  /**
  * Deletes an existing project plan document by its Mongoose `_id`.
  *
  * @param id Mongoose document `_id`.
  * @returns A promise that resolves to the deleted {@link NewProjectsPlan} document,
  * or `null` if no document was found.
  */
  async deleteById(id: string): Promise<NewProjectsPlanDocument | null> {
    return this.newProjectPlansModel.findByIdAndDelete(id);
  }
}
