import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const emailTaken = await this.usersRepository.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new BadRequestException('Email already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      categories: {
        createMany: {
          data: [
            // Income
            { name: 'Salary', icon: 'salary', type: 'INCOME' },
            { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
            { name: 'Other', icon: 'other', type: 'INCOME' },
            // Expense
            { name: 'Home', icon: 'home', type: 'EXPENSE' },
            { name: 'Food', icon: 'food', type: 'EXPENSE' },
            { name: 'Education', icon: 'education', type: 'EXPENSE' },
            { name: 'Fun', icon: 'fun', type: 'EXPENSE' },
            { name: 'Grocery', icon: 'grocery', type: 'EXPENSE' },
            { name: 'Clothes', icon: 'clothes', type: 'EXPENSE' },
            { name: 'Transport', icon: 'transport', type: 'EXPENSE' },
            { name: 'Travel', icon: 'travel', type: 'EXPENSE' },
            { name: 'Outro', icon: 'other', type: 'EXPENSE' },
          ],
        },
      },
    });

    return {
      name: user.name,
      email: user.email,
    };
  }
}
