import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Unique } from 'src/database/validators/unique.validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @Validate(Unique, ['User', this])
  email: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsAlpha()
  @MaxLength(30)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsAlpha()
  @MaxLength(30)
  lastName: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password',
  })
  @ApiProperty()
  @MaxLength(30)
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Projects of the user',
    example: '[{ slug: "dashboard-v3", role: 7 }]',
    type: () => [ProjectUser],
  })
  projects: ProjectUser[];
}

class ProjectUser {
  @MaxLength(15)
  @IsNotEmpty()
  slug: string;
  @IsNumber()
  role: number;
}
