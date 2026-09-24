import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true, toJSON: { virtuals: true, versionKey: false } })
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  phone: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.index({ name: 'text' });
PatientSchema.virtual('age').get(function () {
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
});
