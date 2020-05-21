import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { EntityRepository, Repository } from 'typeorm';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentialsDTO;
    const user = this.create();
    user.username = username;
    user.salt = await genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<string> {
    const { username, password } = authCredentialsDTO;
    const user = await this.findOne({ username });
    const isPasswordValid = user && (await user.validatePassword(password));

    if (isPasswordValid) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }
}
