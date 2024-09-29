import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password',
  })
  @ApiProperty()
  @MaxLength(30)
  @IsNotEmpty()
  @IsString()
  password: string;
}
