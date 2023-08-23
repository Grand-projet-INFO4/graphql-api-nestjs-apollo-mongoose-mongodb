import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';

import {
  EmbeddedPhotoDocument,
  embeddedPhotoSchema,
} from 'src/api/photo/schema';
import {
  VehicleState,
  VehicleStatus,
  plateIdRegExp,
  rearSeatRegExp,
  vehicleStates,
  vehicleStatuses,
} from '../vehicle.constants';
import {
  EmbeddedTrackingDeviceDocument,
  embeddedTrackingDeviceSchema,
} from 'src/api/tracking-device/schema/embedded-tracking-device.schema';
import {
  EmbeddedCarModelDocument,
  embeddedCarModelSchema,
} from 'src/api/car-model/schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import {
  VehicleSeatsCount,
  vehicleSeatsCountSchema,
} from './vehicle-seats-count.schema';
import { type DriverDocument } from 'src/api/driver/schema';

// Vehicles collection name
export const VEHICLE_COLLECTION = 'vehicles';

@Schema({ timestamps: true })
export class Vehicle {
  // (Numéro d'immatriculation de la plaque)
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      return plateIdRegExp.test(value);
    },
  })
  plateId: string;

  @Prop({
    type: MongooseSchema.ObjectId,
  })
  mainPhotoId?: Types.ObjectId;

  @Prop({
    type: [{ type: embeddedPhotoSchema, required: true }],
  })
  photos?: EmbeddedPhotoDocument[];

  @Prop({
    type: String,
    required: true,
    enum: vehicleStatuses,
  })
  status: VehicleStatus;

  @Prop({
    type: String,
    required: true,
    enum: vehicleStates,
  })
  state: VehicleState;

  @Prop({
    type: embeddedTrackingDeviceSchema,
  })
  tracker?: EmbeddedTrackingDeviceDocument;

  @Prop({
    type: embeddedCarModelSchema,
    required: true,
  })
  model: EmbeddedCarModelDocument;

  // The count of the vehicles's seats
  @Prop({
    type: vehicleSeatsCountSchema,
    required: true,
  })
  seatsCount: VehicleSeatsCount;

  // Rear seats that are removed from the original design of the vehicle.
  // They are typically used to free some space for some walking area within the vehicle.
  @Prop({
    type: [
      {
        type: String,
        required: true,
        validate(value: string) {
          return rearSeatRegExp.test(value);
        },
      },
    ],
  })
  removedSeats?: string[];

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
    index: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: 'Trip',
  })
  ongoingTrip?: Types.ObjectId;

  // Assigned drivers ids
  @Prop({
    type: [{ type: MongooseSchema.ObjectId, required: true }],
    ref: 'Driver',
  })
  drivers?: Types.ObjectId[] | DriverDocument[];
}

export const vehicleSchema = SchemaFactory.createForClass(Vehicle);

// Indexes
vehicleSchema.index({ 'tracker.position': '2dsphere' }, { sparse: true });
vehicleSchema.index({ plateId: 'text' });

export type VehicleDocument = HydratedDocument<Vehicle>;
export type VehicleModel = Model<Vehicle>;
