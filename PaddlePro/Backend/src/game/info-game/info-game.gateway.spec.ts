import { Test, TestingModule } from '@nestjs/testing';
import { InfoGameGateway } from './info-game.gateway';

describe('InfoGameGateway', () => {
  let gateway: InfoGameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoGameGateway],
    }).compile();

    gateway = module.get<InfoGameGateway>(InfoGameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
