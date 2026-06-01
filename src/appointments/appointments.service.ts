import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Appointment } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
  ) {}

  async createAppointment(appointmentData: CreateAppointmentDto) {
    return this.appointmentModel.create(appointmentData);
  }

  async getAllAppointments() {
    return this.appointmentModel.find();
  }

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentModel.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async updateAppointment(id: string, updateData: UpdateAppointmentDto) {
    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return updatedAppointment;
  }

  async deleteAppointment(id: string) {
    const deletedAppointment =
      await this.appointmentModel.findByIdAndDelete(id);

    if (!deletedAppointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return deletedAppointment;
  }
}
