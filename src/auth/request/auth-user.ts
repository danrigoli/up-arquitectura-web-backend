import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
  id: number;
  @ApiProperty()
  email: string;

  constructor(email: string, id: number) {
    this.id = id;
    this.email = email;
  }
}
