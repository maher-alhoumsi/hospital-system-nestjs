import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DoctorsModule } from 'src/doctors/doctors.module';
import { AppointmentsService } from './appointments.service';
import { PatientsModule } from 'src/patients/patients.module';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { MedicalRecordsModule } from 'src/medical_records/medical_records.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    DoctorsModule,
    PatientsModule,
    MedicalRecordsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
})
export class AppointmentsModule {}

// patientId: 6a13e8796924b56ee4628cac
//  doctorId: 6a13e8756924b56ee4628ca9
