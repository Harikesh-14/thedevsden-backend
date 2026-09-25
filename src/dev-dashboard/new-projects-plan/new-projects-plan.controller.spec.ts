import { Test, TestingModule } from '@nestjs/testing';
import { NewProjectsPlanController } from './new-projects-plan.controller.js';

describe('NewProjectsPlanController', () => {
  let controller: NewProjectsPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewProjectsPlanController],
    }).compile();

    controller = module.get<NewProjectsPlanController>(NewProjectsPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
