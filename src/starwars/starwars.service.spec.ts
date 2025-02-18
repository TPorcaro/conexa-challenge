import { Test, TestingModule } from '@nestjs/testing';
import { StarWarsService } from './starwars.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StarWarsService', () => {
  let service: StarWarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarsService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StarWarsService>(StarWarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
