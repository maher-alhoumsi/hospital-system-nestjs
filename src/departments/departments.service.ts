import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Department } from './schemas/department.schema';
import { CreateDepartmentDTO } from './dto/create-department.dto';
import { UpdateDepartmentDTO } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
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
}
