import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerController } from './task-manager.controller.js';

describe('TaskManagerController', () => {
  let controller: TaskManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskManagerController],
    }).compile();

    controller = module.get<TaskManagerController>(TaskManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
