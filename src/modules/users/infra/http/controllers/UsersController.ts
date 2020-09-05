import { Request, Response } from 'express';

import CreateUserService from '@modules/users/services/CreateUserService';

import { container } from 'tsyringe';

export default class UserssController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // após criptografar a senha e salvala no banco de dados,
    // deletar a variavel para não exibir este dado sensivel no front end
    delete user.password;

    return response.json(user);
  }
}