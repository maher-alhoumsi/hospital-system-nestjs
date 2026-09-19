import {
  IsEnum,
  IsString,
  IsBoolean,
  IsMongoId,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';

import { Schema as MongooseSchema } from 'mongoose';

export class CreateAppointmentDto {
  @IsMongoId()
  patientId: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  doctorId: MongooseSchema.Types.ObjectId;

  @IsDateString()
  scheduledAt: Date;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsString()
  notes: string;

  @IsBoolean()
  followUp: boolean;
}
