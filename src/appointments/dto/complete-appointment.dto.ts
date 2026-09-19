import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CompleteAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientIssue: string;

  @IsString()
  @IsNotEmpty()
  doctorReport: string;

  @IsArray()
  @IsString({ each: true })
  medications: string[];
}
