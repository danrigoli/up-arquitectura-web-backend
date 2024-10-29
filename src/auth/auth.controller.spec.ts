import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { UserDto } from 'src/users/dto/response/user.dto';
import { RequestUser } from './request/request-user.interface';
import { User } from 'src/users/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            getProfile: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const req: RequestUser = {
        user: { id: 1, email: 'test@example.com' },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        // Add other required properties as needed
      } as any;
      const body: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = { accessToken: 'token', refreshToken: 'refreshToken' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(req, body)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(req.user);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
      };
      const result = { id: 1 };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(createUserDto)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const req: RequestUser = {
        user: { id: 1, email: 'test@example.com' },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        // Add other required properties as needed
      } as any;
      const user: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userDto: UserDto = new UserDto(user);
      jest.spyOn(authService, 'getProfile').mockResolvedValue(user);

      expect(await authController.getProfile(req)).toEqual(userDto);
      expect(authService.getProfile).toHaveBeenCalledWith(req.user.id);
    });
  });

  describe('refresh', () => {
    it('should refresh token', async () => {
      const req: RequestUser = {
        user: { id: 1, email: 'test@example.com' },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        // Add other required properties as needed
      } as any;

      const result = { accessToken: 'newToken' };

      jest.spyOn(authService, 'refresh').mockResolvedValue(result);

      expect(await authController.refresh(req)).toBe(result);
      expect(authService.refresh).toHaveBeenCalledWith(req.user);
    });
  });
});
