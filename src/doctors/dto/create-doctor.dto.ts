import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

import { Schema as MongooseSchema } from 'mongoose';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  departmentId: MongooseSchema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  specialization: string;
}
