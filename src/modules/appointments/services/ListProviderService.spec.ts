import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from '@modules/appointments/services/ListProviderService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers.', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johnoe@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John tre',
      email: 'johnoe@example.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John qua',
      email: 'johnoe@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
