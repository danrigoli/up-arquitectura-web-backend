import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, Validate } from 'class-validator';
import { Unique } from 'src/database/validators/unique.validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @Validate(Unique, ['User', this])
  email: string;
}
