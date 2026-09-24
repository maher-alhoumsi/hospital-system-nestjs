import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  Controller,
  Query,
} from '@nestjs/common';

import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  createDoctor(@Body() doctor: CreateDoctorDto) {
    return this.doctorsService.createDoctor(doctor);
  }

  @Get()
  getDoctors() {
    return this.doctorsService.getDoctors();
  }

  @Get('search')
  searchDoctors(@Query('q') query: string) {
    return this.doctorsService.searchDoctors(query);
  }

  @Get(':id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  @Patch(':id')
  updateDoctor(@Param('id') id: string, @Body() updateData: UpdateDoctorDto) {
    return this.doctorsService.updateDoctor(id, updateData);
  }

  @Delete(':id')
  deleteDoctor(@Param('id') id: string) {
    return this.doctorsService.deleteDoctor(id);
  }
}
