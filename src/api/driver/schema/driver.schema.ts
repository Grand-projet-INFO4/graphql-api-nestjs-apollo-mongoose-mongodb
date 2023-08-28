import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';

import { DriverLicense, driverLicenseSchema } from './driver-license.schema';
import { User, UserDocument } from 'src/api/user/schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import {
  Vehicle,
  VehicleDocument,
} from 'src/api/vehicle/schema/vehicle.schema';
import { TripDocument } from 'src/api/trip/schema';

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

  @Prop({ type: Date, index: true, sparse: true })
  hiredAt?: Date;

  @Prop({ type: Date, index: true, sparse: true })
  latestTripAt?: Date;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: User.name,
    unique: true,
    sparse: true,
  })
  user?: Types.ObjectId | UserDocument;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    index: true,
    sparse: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: 'Trip',
  })
  ongoingTrip?: Types.ObjectId | TripDocument;

  @Prop({ type: MongooseSchema.ObjectId, ref: Vehicle.name })
  vehicle?: Types.ObjectId | VehicleDocument;

  @Prop({ type: Date, index: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const driverSchema = SchemaFactory.createForClass(Driver);

// Indexes
driverSchema.index({ 'license.licenseId': 1 }, { unique: true });
driverSchema.index({ cooperative: 1, hiredAt: 1 }, { sparse: true });
driverSchema.index({ firstName: 'text', lastName: 'text' });

export type DriverDocument = HydratedDocument<Driver>;
export type DriverModel = Model<Driver>;
