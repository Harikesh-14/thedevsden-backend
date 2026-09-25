import { Test, TestingModule } from '@nestjs/testing';
import { NewProjectsPlanService } from './new-projects-plan.service.js';

describe('NewProjectsPlanService', () => {
  let service: NewProjectsPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewProjectsPlanService],
    }).compile();

    service = module.get<NewProjectsPlanService>(NewProjectsPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
