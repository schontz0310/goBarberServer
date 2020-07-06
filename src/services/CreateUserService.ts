import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User); // nao foi craido repositorio, porque os metodos padroes do typeorm são suficinetes

    // Rule for check email already exist
    const checkEmailExist = await usersRepository.findOne({
      where: { email },
    });

    if (checkEmailExist) {
      throw new AppError('this email already exist');
    }

    // Regra de criptografia do password
    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
