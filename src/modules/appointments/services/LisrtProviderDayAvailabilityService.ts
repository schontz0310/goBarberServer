/* eslint-disable no-plusplus */
/* eslint-disable camelcase */

import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProvidersDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        month,
        year,
        provider_id,
      },
    );

    const currentDate = new Date(Date.now());

    const eachHourInDay: Array<number> = [];

    for (let i = 8; i <= 17; i++) {
      eachHourInDay.push(i);
    }

    const availabilty: IResponse = eachHourInDay.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const appointmentTimestamp = new Date(year, month - 1, day, hour);

      return {
        hour,
        available:
          !hasAppointmentInHour && isAfter(appointmentTimestamp, currentDate),
      };
    });

    return availabilty;
  }
}
export default ListProvidersDayAvailabilityService;
