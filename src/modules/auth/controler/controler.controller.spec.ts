import { Test, TestingModule } from '@nestjs/testing';
import { ControlerController } from './controler.controller';

describe('ControlerController', () => {
  let controller: ControlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlerController],
    }).compile();

    controller = module.get<ControlerController>(ControlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
