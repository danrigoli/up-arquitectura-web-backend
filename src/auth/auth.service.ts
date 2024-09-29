import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './request/auth-user';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      const isMatch = await bcrypt.compare(password, user?.password);
      Logger.debug(`Validating ${email}. Is valid: ${isMatch}`);
      return isMatch ? new AuthUser(email, user.id) : null;
    } catch (e) {
      return null;
    }
  }

  async login(user: AuthUser) {
    Logger.debug(`Logging in user ${user.id}`);
    const payload = {
      email: user.email,
      id: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '3600s',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(user: AuthUser) {
    Logger.debug(`Refreshing token for user ${user.id}`);
    const payload = {
      email: user.email,
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '3600s',
    });
    return {
      access_token: accessToken,
    };
  }

  async register(user: CreateUserDto) {
    const createdUser = await this.usersService.create(user);
    return { id: createdUser.id };
  }

  async getProfile(id: number) {
    return this.usersService.findOne(id);
  }
}
