import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  async createDoctor(doctor: CreateDoctorDto) {
    const createdDoctor = await this.doctorModel.create(doctor);
    return createdDoctor;
  }

  async getDoctors() {
    return await this.doctorModel.find();
  }

  async getDoctorById(id: string) {
    const doctor = await this.doctorModel.findById(id);

    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return doctor;
  }

  async updateDoctor(id: string, updateData: UpdateDoctorDto) {
    const doctor = await this.doctorModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return doctor;
  }

  async deleteDoctor(id: string) {
    const doctor = await this.doctorModel.findByIdAndDelete(id);

    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return doctor;
  }
}
