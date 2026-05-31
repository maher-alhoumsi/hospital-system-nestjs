import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Patient } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto) {
    return this.patientModel.create(createPatientDto);
  }

  async getAllPatients() {
    return this.patientModel.find();
  }

  async getPatientById(id: string) {
    const patient = await this.patientModel.findById(id);

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return patient;
  }

  async updatePatient(id: string, patient: UpdatePatientDto) {
    const updatedPatient = await this.patientModel.findByIdAndUpdate(
      id,
      { $set: patient },
      { returnDocument: 'after' },
    );

    if (!updatedPatient) throw new NotFoundException();

    return updatedPatient;
  }

  async deletePatient(id: string) {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id);

    if (!deletedPatient) {
      throw new NotFoundException('Patient Not Found!');
    }

    return deletedPatient;
  }
}
