import {
  IsEnum,
  IsString,
  IsBoolean,
  IsMongoId,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export class CreateAppointmentDto {
  @IsMongoId()
  patientId: string;

  @IsMongoId()
  doctorId: string;

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
