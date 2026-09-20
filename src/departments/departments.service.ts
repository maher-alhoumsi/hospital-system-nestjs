import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Department } from './schemas/department.schema';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { CreateDepartmentDTO } from './dto/create-department.dto';
import { UpdateDepartmentDTO } from './dto/update-department.dto';
import { Appointment } from 'src/appointments/schemas/appointment.schema';
@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async createDepartment(department: CreateDepartmentDTO) {
    return this.departmentModel.create(department);
  }

  async getDepartments() {
    const departments = await this.departmentModel.find();

    return departments;
  }

  async getDepartmentById(id: string) {
    const department = await this.departmentModel.findById(id);

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return department;
  }

  async updateDepartment(id: string, department: UpdateDepartmentDTO) {
    const updatedDepartment = await this.departmentModel.findByIdAndUpdate(
      id,
      { $set: department },
      { returnDocument: 'after' },
    );

    if (!updatedDepartment) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return updatedDepartment;
  }

  async deleteDepartment(id: string) {
    const deletedDepartment = await this.departmentModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return deletedDepartment;
  }

  async getDepartmentStats(id: string) {
    const department = await this.departmentModel.findById(id);

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    const [totalDoctor, stats] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.doctorModel.countDocuments({
        departmentId: department._id,
      } as any),
      this.appointmentModel.aggregate<{
        _id: string;
        count: number;
      }>([
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
          },
        },
        { $unwind: '$doctor' },
        { $match: { 'doctor.departmentId': department._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      department: department.name,
      totalDoctors: totalDoctor,
      totalAppointments: stats.reduce((acc, curr) => acc + curr.count, 0),
      appointmentsByStatus: stats.reduce(
        (acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
