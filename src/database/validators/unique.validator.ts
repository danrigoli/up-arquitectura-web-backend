import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, Not } from 'typeorm';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class Unique implements ValidatorConstraintInterface {
  constructor(private entityManager: EntityManager) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const [EntityClass] = validationArguments.constraints;
    const uniqueOrUpdate = validationArguments.object.hasOwnProperty('id')
      ? { id: Not(validationArguments.object['id']) }
      : {};

    return (
      (await this.entityManager.getRepository(EntityClass).count({
        where: {
          [validationArguments.property]: value,
          ...uniqueOrUpdate,
        },
      })) <= 0
    );
  }

  public defaultMessage(arguments_: ValidationArguments) {
    const [EntityClass] = arguments_.constraints;
    const entity = EntityClass || 'Entity';
    return `${entity} with the same '${arguments_.property}' already exist`;
  }
}
