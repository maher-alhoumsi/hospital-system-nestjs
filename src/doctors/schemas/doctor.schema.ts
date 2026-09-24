import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Department } from 'src/departments/schemas/department.schema';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    ref: Department.name,
    type: MongooseSchema.Types.ObjectId,
  })
  departmentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  specialization: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
DoctorSchema.index({ name: 'text', specialization: 'text' });
