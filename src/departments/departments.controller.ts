import {
  Body,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Controller,
} from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { CreateDepartmentDTO } from './dto/create-department.dto';
import { UpdateDepartmentDTO } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Post()
  createDepartment(@Body() body: CreateDepartmentDTO) {
    return this.departmentsService.createDepartment(body);
  }

  @Get()
  getDepartments() {
    return this.departmentsService.getDepartments();
  }

  @Get(':id')
  getDepartmentById(@Param('id') id: string) {
    return this.departmentsService.getDepartmentById(id);
  }

  @Get(':id/stats')
  getDepartmentStats(@Param('id') id: string) {
    return this.departmentsService.getDepartmentStats(id);
  }

  @Patch(':id')
  updateDepartment(@Param('id') id: string, @Body() body: UpdateDepartmentDTO) {
    return this.departmentsService.updateDepartment(id, body);
  }

  @Delete(':id')
  deleteDepartment(@Param('id') id: string) {
    return this.departmentsService.deleteDepartment(id);
  }
}
