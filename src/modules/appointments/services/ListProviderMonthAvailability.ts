/* eslint-disable no-plusplus */
/* eslint-disable camelcase */

import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

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

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    /* const eachDayInMouth = Array.from(
      { length: numberOfDaysInMounth },
      (_, index) => index + 1,
    ); */

    const eachDayInMouth: Array<number> = [];

    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      eachDayInMouth.push(i);
    }

    const availability = eachDayInMouth.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
export default ListProvidersMonthAvailabilityService;
