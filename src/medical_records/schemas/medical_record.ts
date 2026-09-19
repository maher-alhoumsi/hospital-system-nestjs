import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { Patient } from 'src/patients/schemas/patient.schema';
import { Appointment } from 'src/appointments/schemas/appointment.schema';

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({
    required: true,
    ref: Patient.name,
    type: MongooseSchema.Types.ObjectId,
  })
  patientId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    ref: Doctor.name,
    type: MongooseSchema.Types.ObjectId,
  })
  doctorId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    ref: Appointment.name,
    type: MongooseSchema.Types.ObjectId,
  })
  appointmentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  patientIssue: string;

  @Prop({ required: true })
  doctorReport: string;

  @Prop({ required: true })
  medications: string[];
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
