import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  departmentId: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;
}
