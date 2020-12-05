import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { Errors } from './enum/errors.enum';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSignUpDto } from './dto/user-sign-up.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userSignUpDto: UserSignUpDto): Promise<User> {
    const { login, password } = userSignUpDto;

    const user: User = this.create();

    user.login = login.toLowerCase();
    user.password = await User.hashPassword(password);

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(Errors.USERNAME_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<User> {
    const { login, password } = userLoginDto;

    const user = await this.findOne({
      where: [{ login: login.toLowerCase() }],
    });
    if (user === undefined) {
      throw new BadRequestException(Errors.COULDNT_FOUND_USER);
    } else {
      const passwordCorrect = await user.validatePassword(password);

      if (passwordCorrect === false) {
        throw new BadRequestException(Errors.UNCORRECT_PASSWORD_OR_LOGIN);
      } else {
        return user;
      }
    }
  }
}
