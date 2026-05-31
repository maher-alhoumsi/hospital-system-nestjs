import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
