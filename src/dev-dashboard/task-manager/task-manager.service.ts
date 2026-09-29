import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schema/task-manager.schema.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class TaskManagerService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskManagerModel: Model<TaskDocument>,
  ) { }

  /**
   * Creates a new task using the provided task data.
   *
   * @param dto - Data required to create the task.
   * @returns The newly created task document.
   */
  async create(dto: CreateTaskDto): Promise<TaskDocument> {
    return await this.taskManagerModel.create(dto);
  }

  /**
   * Retrieves all tasks from the database.
   *
   * @returns An array containing all task documents.
   */
  async findAll(): Promise<TaskDocument[]> {
    return this.taskManagerModel.find().exec();
  }

  /**
   * Retrieves a task by its MongoDB document ID.
   *
   * @param id - The unique MongoDB ID of the task.
   * @returns The matching task document.
   * @throws {NotFoundException} If no task exists with the provided ID.
   */
  async findById(id: string): Promise<TaskDocument> {
    const task = await this.taskManagerModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException(
        `Task with task id "${id}" not found`,
      );
    }

    return task;
  }

  /**
   * Updates the specified fields of an existing task.
   *
   * Only the fields provided in the DTO are updated.
   * Mongoose schema validators are executed before the update is applied.
   *
   * @param id - The unique MongoDB ID of the task to update.
   * @param dto - The task fields to update.
   * @returns The updated task document.
   * @throws {NotFoundException} If no task exists with the provided ID.
   */
  async updateTask(
    id: string,
    dto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.taskManagerModel
      .findByIdAndUpdate(
        id,
        { $set: dto },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .exec();

    if (!task) {
      throw new NotFoundException(
        `Task with the task id "${id}" not found`,
      );
    }

    return task;
  }

  /**
   * Updates the completion status of an existing task.
   *
   * @param id - The unique MongoDB ID of the task.
   * @param dto - The new completion status of the task.
   * @returns The updated task document.
   * @throws {NotFoundException} If no task exists with the provided ID.
   */
  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
  ): Promise<TaskDocument> {
    const task = await this.taskManagerModel
      .findByIdAndUpdate(
        id,
        { $set: { isCompleted: dto.isCompleted } },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .exec();

    if (!task) {
      throw new NotFoundException(
        `Task with the task id "${id}" not found`,
      );
    }

    return task;
  }

  /**
   * Deletes an existing task from the database.
   *
   * @param id - The unique MongoDB ID of the task to delete.
   * @throws {NotFoundException} If no task exists with the provided ID.
   */
  async remove(id: string): Promise<void> {
    const result = await this.taskManagerModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Task with ID "${id}" not found`,
      );
    }
  }
}