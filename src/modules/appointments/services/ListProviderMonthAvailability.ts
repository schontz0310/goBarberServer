/* eslint-disable no-plusplus */
/* eslint-disable camelcase */

import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth } from 'date-fns';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProvidersMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        month,
        year,
        provider_id,
      },
    );

    const numberOfDaysInMounth = getDaysInMonth(new Date(year, month - 1));

    /* const eachDayInMouth = Array.from(
      { length: numberOfDaysInMounth },
      (_, index) => index + 1,
    ); */

    const eachDayInMouth: Array<number> = [];

    for (let i = 1; i <= numberOfDaysInMounth; i++) {
      eachDayInMouth.push(i);
    }

    const availability = eachDayInMouth.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
export default ListProvidersMonthAvailabilityService;
