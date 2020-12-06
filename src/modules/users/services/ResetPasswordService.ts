import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  password: string;
  token: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(data.token);
    if (!userToken) {
      throw new AppError('User token dos not exists');
    }
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('This Token was expired');
    }
    user.password = await this.hashProvider.generateHash(data.password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
