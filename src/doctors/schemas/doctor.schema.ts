import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  departmentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  specialization: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
