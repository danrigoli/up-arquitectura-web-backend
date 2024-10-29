import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/response/user.dto';
import { CurrentUserGuard } from './guards/current-user.guard';

@ApiTags('users')
@Controller('users')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: UserDto,
    isArray: true,
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserDto(user));
  }

  @UseGuards(AuthGuard('jwt'), CurrentUserGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserDto,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), CurrentUserGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), CurrentUserGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User deleted',
  })
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
