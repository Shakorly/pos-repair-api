import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password,  10);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      ...(createUserDto.role && { role: createUserDto.role }),
    });

    await this.usersRepository.save(user);

    return this.findOne(user.id)
    
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'createdAt',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, isActive: true },
    });
  } 

  async findById(id: string){
    return this.usersRepository.findOne({
      where: {id},
    })
  }
}
