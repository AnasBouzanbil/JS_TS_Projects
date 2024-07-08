import { Test, TestingModule } from '@nestjs/testing';
import { GameServiceService } from './game-service.service';

describe('GameServiceService', () => {
  let service: GameServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameServiceService],
    }).compile();

    service = module.get<GameServiceService>(GameServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
