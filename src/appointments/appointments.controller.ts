import {
  Body,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';

@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post('appointments')
  createAppointment(@Body() appointment: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(appointment);
  }

  @Get('appointments')
  getAllAppointments() {
    return this.appointmentService.getAllAppointments();
  }

  @Get('doctors/:id/appointments')
  getDoctorAppointments(@Param('id') doctorId: string) {
    return this.appointmentService.getAppointmentsByDoctorId(doctorId);
  }

  @Get('doctors/:id/schedule')
  getDoctorSchedule(@Param('id') id: string, @Query('date') date: string) {
    return this.appointmentService.getDoctorSchedule(id, date);
  }

  @Get('patients/:id/appointments')
  getPatientAppointments(@Param('id') id: string) {
    return this.appointmentService.getAppointmentsByPatientId(id);
  }

  @Get('patients/:id/medical-record')
  getPatientMedicalRecord(@Param('id') id: string) {
    return this.appointmentService.getPatientMedicalRecord(id);
  }

  @Get('appointments/report')
  getAppointmentsReport() {
    return this.appointmentService.getAppointmentsReport();
  }

  @Patch('appointments/:id/complete')
  completeAppointment(
    @Param('id') id: string,
    @Body() body: CompleteAppointmentDto,
  ) {
    return this.appointmentService.completeAppointment(id, body);
  }

  @Patch('appointments/:id/cancel')
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentService.cancelAppointment(id);
  }

  @Get('appointments/:id')
  getAppointmentById(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Patch('appointments/:id')
  updateAppointment(
    @Param('id') id: string,
    @Body() updateData: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, updateData);
  }

  @Delete('appointments/:id')
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentService.deleteAppointment(id);
  }
}
