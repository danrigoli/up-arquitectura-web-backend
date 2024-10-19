import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, Not } from 'typeorm';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class Exists implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const [EntityClass] = validationArguments.constraints;
    const uniqueOrUpdate = validationArguments.object.hasOwnProperty('id')
      ? { id: Not(validationArguments.object['id']) }
      : {};

    return (
      (await this.entityManager.getRepository(EntityClass).count({
        where: {
          id: value,
          ...uniqueOrUpdate,
        },
      })) > 0
    );
  }

  public defaultMessage(arguments_: ValidationArguments) {
    const [EntityClass] = arguments_.constraints;
    const entity = EntityClass || 'Entity';
    return `${entity} with '${arguments_.property}' doesn't exist`;
  }
}
