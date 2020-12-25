/* eslint-disable camelcase */
import { Router } from 'express';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensureAuthenticated);
// providersRouter.get('/', async (request, response) => {
//  const appointments = await appointmentsRepository.find();
//  return response.json(appointments);
// });

providersRouter.get('/', providersController.index);

export default providersRouter;
