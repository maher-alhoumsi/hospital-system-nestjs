import {
  Body,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post()
  createAppointment(@Body() appointment: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(appointment);
  }

  @Get()
  getAllAppointments() {
    return this.appointmentService.getAllAppointments();
  }

  @Get(':id')
  getAppointmentById(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Patch(':id')
  updateAppointment(
    @Param('id') id: string,
    @Body() updateData: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, updateData);
  }

  @Delete(':id')
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentService.deleteAppointment(id);
  }
}
