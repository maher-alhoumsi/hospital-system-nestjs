import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Appointment } from './schemas/appointment.schema';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { Patient } from 'src/patients/schemas/patient.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';
import { MedicalRecord } from 'src/medical_records/schemas/medical_record';

@Injectable()
export class AppointmentsService implements OnModuleInit {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,

    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(MedicalRecord.name)
    private readonly medicalRecordModel: Model<MedicalRecord>,
  ) {}

  onModuleInit() {
    const changeStream = this.appointmentModel.watch<
      Appointment,
      mongoose.mongo.ChangeStreamDocument<Appointment>
    >([{ $match: { operationType: 'update' } }]);

    changeStream.on('change', (change) => {
      if (change.operationType !== 'update') return;

      const docId = change.documentKey._id;
      const operationType = change.operationType;
      const updatedFields = change.updateDescription.updatedFields;

      console.log(`Operation Type is : ${operationType}`);
      console.log(`Appointment ${docId.toString()} updated:`, updatedFields);
    });
  }

  async createAppointment(appointmentData: CreateAppointmentDto) {
    const existingDoctor = await this.doctorModel.findById(
      appointmentData.doctorId,
    );

    if (!existingDoctor) {
      throw new NotFoundException('Doctor not found');
    }

    const existingPatient = await this.patientModel.findById(
      appointmentData.patientId,
    );

    if (!existingPatient) {
      throw new NotFoundException('Patient not found');
    }

    const existingDoctorAppointment = await this.appointmentModel.findOne({
      doctorId: appointmentData.doctorId,
      scheduledAt: appointmentData.scheduledAt,
    });

    if (existingDoctorAppointment) {
      throw new ConflictException(
        'Doctor is not available at the selected time',
      );
    }

    const existingPatientAppointment = await this.appointmentModel.findOne({
      patientId: appointmentData.patientId,
      scheduledAt: appointmentData.scheduledAt,
    });

    if (existingPatientAppointment) {
      throw new ConflictException(
        'Patient already has an appointment at the selected time',
      );
    }

    return this.appointmentModel.create(appointmentData);
  }

  async getAllAppointments() {
    return this.appointmentModel.find().lean();
  }

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentModel.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async updateAppointment(id: string, updateData: UpdateAppointmentDto) {
    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return updatedAppointment;
  }

  async deleteAppointment(id: string) {
    const deletedAppointment =
      await this.appointmentModel.findByIdAndDelete(id);

    if (!deletedAppointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return deletedAppointment;
  }

  async getAppointmentsByPatientId(patientId: string) {
    const patient = await this.patientModel.findById(patientId);

    if (!patient)
      throw new NotFoundException(`Patient with id ${patientId} not found`);

    return this.appointmentModel.aggregate([
      {
        $match: { patientId: new mongoose.Types.ObjectId(patientId) },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: '$doctor' },
      {
        $project: {
          notes: 1,
          status: 1,
          followUp: 1,
          scheduledAt: 1,
          'doctor.name': 1,
          'doctor.specialization': 1,
        },
      },
    ]);
  }

  async getAppointmentsByDoctorId(doctorId: string) {
    const doctor = await this.doctorModel.findById(doctorId);

    if (!doctor) throw new NotFoundException('Doctor not found');

    return this.appointmentModel.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient',
        },
      },
      { $unwind: '$patient' },
      {
        $project: {
          status: 1,
          notes: 1,
          followUp: 1,
          scheduledAt: 1,
          'patient.name': 1,
          'patient.dateOfBirth': 1,
        },
      },
    ]);
  }

  async getDoctorSchedule(id: string, date: string) {
    if (!date) {
      throw new BadRequestException('Date query parameter is required');
    }

    const doctor = await this.doctorModel.findById(id);

    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    const startDate = new Date(date);

    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.appointmentModel.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(id),
          scheduledAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient',
        },
      },
      { $unwind: '$patient' },
      { $sort: { scheduledAt: 1 } },
      {
        $project: {
          followUp: 1,
          notes: 1,
          status: 1,
          scheduledAt: 1,
          'patient.name': 1,
          'patient.phone': 1,
        },
      },
    ]);
  }

  async completeAppointment(id: string, body: CompleteAppointmentDto) {
    const appointment = await this.appointmentModel.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    if (
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new ConflictException(
        `Appointment with id ${id} is already completed or cancelled`,
      );
    }

    const session = await this.appointmentModel.db.startSession();

    session.startTransaction();

    try {
      appointment.status = AppointmentStatus.COMPLETED;
      await appointment.save({ session });

      const medicalRecord = new this.medicalRecordModel({
        appointmentId: appointment._id,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        ...body,
      });

      await medicalRecord.save({ session });

      await session.commitTransaction();

      return {
        message:
          'Appointment completed and medical record created successfully',
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getPatientMedicalRecord(id: string) {
    const patient = await this.patientModel.findById(id);

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return this.medicalRecordModel.aggregate([
      { $match: { patientId: new mongoose.Types.ObjectId(id) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment',
        },
      },
      { $unwind: { path: '$appointment', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          medications: 1,
          patientIssue: 1,
          doctorReport: 1,
          'doctor.name': 1,
          'appointment.status': 1,
          'doctor.specialization': 1,
          'appointment.scheduledAt': 1,
        },
      },
    ]);
  }

  async cancelAppointment(id: string) {
    const appointment = await this.appointmentModel.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    if (
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new ConflictException(
        `Appointment with id ${id} is already completed or cancelled`,
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return await appointment.save();
  }

  async getAppointmentsReport() {
    const [totalAppointments, appointmentsByStatus, topDoctors] =
      await Promise.all([
        this.appointmentModel.countDocuments(),

        this.appointmentModel.aggregate<{
          count: number;
          _id: AppointmentStatus;
        }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

        this.appointmentModel.aggregate([
          {
            $lookup: {
              from: 'doctors',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor',
            },
          },
          { $unwind: '$doctor' },
          {
            $group: {
              _id: '$doctorId',
              totalAppointments: { $sum: 1 },
              name: { $first: '$doctor.name' },
            },
          },
          { $sort: { totalAppointments: -1 } },
          { $limit: 3 },
          { $project: { _id: 0, name: 1, totalAppointments: 1 } },
        ]),
      ]);

    const byStatus = appointmentsByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return {
      byStatus,
      topDoctors,
      totalAppointments,
    };
  }
}
