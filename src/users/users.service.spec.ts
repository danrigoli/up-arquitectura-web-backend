import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };

      jest.spyOn(repository, 'create').mockReturnValue(createUserDto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createUserDto as any);

      const result = await service.create(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(user);

      const result = await service.findOneByEmail('john.doe@example.com');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.findOneByEmail('notfound@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'newpassword',
      };
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(user);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.delete(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
