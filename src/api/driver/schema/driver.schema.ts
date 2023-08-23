import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';

import { DriverLicense, driverLicenseSchema } from './driver-license.schema';
import { User } from 'src/api/user/schema';
import { Cooperative } from 'src/api/cooperative/schema';
import { Vehicle } from 'src/api/vehicle/schema/vehicle.schema';

// Drivers collection name
export const DRIVER_COLLECTION = 'drivers';

@Schema({ timestamps: true })
export class Driver {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop()
  photo?: string;

  @Prop({ type: driverLicenseSchema, required: true })
  license: DriverLicense;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: [{ type: String, required: true }], required: true })
  phones: string[];

  @Prop({ type: Date })
  hiredAt?: Date;

  @Prop({ type: Date })
  latestTripAt?: Date;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: User.name,
    unique: true,
    sparse: true,
  })
  user?: Types.ObjectId;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
    index: true,
  })
  cooperative: Types.ObjectId;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: 'Trip',
    index: true,
    sparse: true,
  })
  ongoingTrip?: Types.ObjectId;

  @Prop({ type: MongooseSchema.ObjectId, ref: Vehicle.name })
  vehicle?: Types.ObjectId;
}

export const driverSchema = SchemaFactory.createForClass(Driver);

// Indexes
driverSchema.index({ 'license.licenseId': 1 }, { unique: true });
driverSchema.index({ firstName: 'text', lastName: 'text' });

export type DriverDocument = HydratedDocument<Driver>;
export type DriverModel = Model<Driver>;
