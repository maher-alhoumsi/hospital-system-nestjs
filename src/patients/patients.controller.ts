import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  Controller,
} from '@nestjs/common';

import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.createPatient(createPatientDto);
  }

  @Get()
  getAllPatients() {
    return this.patientsService.getAllPatients();
  }

  @Get(':id')
  getPatientById(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Patch(':id')
  updatePatient(@Param('id') id: string, @Body() body: UpdatePatientDto) {
    return this.patientsService.updatePatient(id, body);
  }

  @Delete(':id')
  removePatient(@Param('id') id: string) {
    return this.patientsService.deletePatient(id);
  }
}
