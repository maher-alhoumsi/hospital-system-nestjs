import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDepartmentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  displayOrder: number;
}
