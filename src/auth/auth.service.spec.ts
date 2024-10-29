import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './dto/response/auth-user';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { User } from 'src/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return AuthUser if validation is successful', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash(password, 10),
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);

      const result = await service.validateUser(email, password);
      expect(result).toEqual(new AuthUser(email, user.id));
    });

    it('should return null if validation fails', async () => {
      const email = 'test@example.com';
      const password = 'password';
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      const result = await service.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = new AuthUser('test@example.com', 1);
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await service.login(user);
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('refresh', () => {
    it('should return a new access token', async () => {
      const user = new AuthUser('test@example.com', 1);
      const accessToken = 'newAccessToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await service.refresh(user);
      expect(result).toEqual({ accessToken });
    });
  });

  describe('register', () => {
    it('should create a new user and return its id', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
      };
      const createdUser: User = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createUserDto,
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

      const result = await service.register(createUserDto);
      expect(result).toEqual({ id: createdUser.id });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await service.getProfile(1);
      expect(result).toEqual(user);
    });
  });
});
