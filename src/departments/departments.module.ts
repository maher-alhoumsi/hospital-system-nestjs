import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DepartmentsService } from './departments.service';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { DepartmentsController } from './departments.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { Department, DepartmentSchema } from './schemas/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
    DoctorsModule,
    AppointmentsModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
