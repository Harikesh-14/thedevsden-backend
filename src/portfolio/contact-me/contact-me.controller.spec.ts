import { Test, TestingModule } from '@nestjs/testing';
import { ContactMeController } from './contact-me.controller.js';

describe('ContactMeController', () => {
  let controller: ContactMeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactMeController],
    }).compile();

    controller = module.get<ContactMeController>(ContactMeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
