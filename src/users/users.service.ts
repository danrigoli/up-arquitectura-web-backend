import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);

    const user = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { email: email },
      });
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const update: Partial<User> = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email: updateUserDto.email,
    };

    if (updateUserDto.password) {
      update.password = bcrypt.hashSync(updateUserDto.password, 10);
    }

    const result = await this.usersRepository.update({ id: id }, update);

    if (result.affected === 1) {
      return this.usersRepository.findOne({
        where: { id: id },
      });
    }
  }

  async delete(id: number): Promise<User> {
    const userToDelete = await this.usersRepository.findOne({
      where: { id: id },
    });
    const result = await this.usersRepository.softDelete({ id: id });

    if (result.affected === 1) {
      return userToDelete;
    } else {
      throw new NotFoundException('No se encontro el usuario.');
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return bcrypt.hash(password, saltOrRounds);
  }
}
