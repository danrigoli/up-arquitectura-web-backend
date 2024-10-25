import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { Validate } from 'class-validator';
import { Exists } from 'src/database/validators/exists.validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'ID of the category',
    example: 1,
  })
  @Validate(Exists, ['Payment'])
  id: number;
}
