import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { Patient } from 'src/patients/schemas/patient.schema';
import { AppointmentStatus } from '../enums/appointment-status.enum';

@Schema({ timestamps: true })
export class Appointment {
  @Prop({
    required: true,
    ref: Patient.name,
    type: MongooseSchema.Types.ObjectId,
  })
  patientId: string;

  @Prop({
    required: true,
    ref: Doctor.name,
    type: MongooseSchema.Types.ObjectId,
  })
  doctorId: string;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ default: AppointmentStatus.SCHEDULED, enum: AppointmentStatus })
  status: AppointmentStatus;

  @Prop({ required: true })
  notes: string;

  @Prop({ required: true })
  followUp: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
