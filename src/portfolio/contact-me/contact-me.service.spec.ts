import { Test, TestingModule } from '@nestjs/testing';
import { ContactMeService } from './contact-me.service.js';

describe('ContactMeService', () => {
  let service: ContactMeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactMeService],
    }).compile();

    service = module.get<ContactMeService>(ContactMeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
