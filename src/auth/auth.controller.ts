import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestUser } from './request/request-user.interface';
import { UserDto } from 'src/users/dto/response/user.dto';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: RequestUser, @Body() body: LoginDto) {
    Logger.debug(`User ${body.email} logged in`);
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ id: number }> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: RequestUser): Promise<UserDto> {
    Logger.debug(`REQ.USER: ${JSON.stringify(req.user)}`);
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Request() req: RequestUser) {
    return this.authService.refresh(req.user);
  }
}
