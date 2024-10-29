import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../users/entities/user.entity';

export class UserDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'test@example.com' })
  email?: string;

  @ApiProperty({ example: 'John' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  constructor(user: User) {
    this.id = user?.id;
    this.email = user?.email;
    this.firstName = user?.firstName;
    this.lastName = user?.lastName;
  }
}
