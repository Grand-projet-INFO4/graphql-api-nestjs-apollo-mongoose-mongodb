import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';

import {
  EmbeddedBookingDocument,
  embeddedBookingSchema,
} from 'src/api/booking/schema';
import {
  Driver,
  DriverDocument,
  TripDriverDocument,
  tripDriverSchema,
} from 'src/api/driver/schema';
import {
  EmbeddedRouteDocument,
  embeddedRouteSchema,
} from 'src/api/route/schema';
import { isValidSeat } from 'src/api/vehicle/helpers/is-valid-seat.helper';
import {
  EmbeddedVehicleDocument,
  Vehicle,
  VehicleDocument,
  embeddedVehicleSchema,
} from 'src/api/vehicle/schema';
import { TripPath, tripPathSchema } from 'src/api/trip/schema/trip-path.schema';
import { TripStatus, tripStatuses } from '../trip.constants';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';

// Trips collection name
export const TRIP_COLLECTION = 'trips';

@Schema({ timestamps: true })
export class Trip {
  @Prop({ type: embeddedRouteSchema, required: true })
  route: EmbeddedRouteDocument;

  @Prop({ type: tripPathSchema, required: true })
  path: TripPath;

  // Snapshot of the trip's actual vehicle's details
  @Prop({ type: embeddedVehicleSchema, required: true })
  currentVehicle: EmbeddedVehicleDocument;

  // Snapshot the trip's actual drivers' details
  @Prop({ type: [{ type: tripDriverSchema, required: true }], required: true })
  currentDrivers: TripDriverDocument[];

  // Seats that cannot be booked by the passengers as they are reserved for special use cases for the trip
  // A common example is when the trip requires 2 drivers at the same vehicle
  // so there must be a seat that is allocated for the other driver when he is not the one currently driving
  @Prop({
    type: [
      {
        type: String,
        required: true,
        validate: (value: string) => isValidSeat(value),
      },
    ],
  })
  reservedSeats?: string[];

  // The bookings details of the passengers
  @Prop({
    type: [{ type: embeddedBookingSchema, required: true }],
    required: true,
    default: [],
  })
  bookings: EmbeddedBookingDocument[];

  @Prop({
    type: String,
    required: true,
    enum: tripStatuses,
    default: TripStatus.Ongoing,
  })
  status: TripStatus;

  // Delay in minutes before the date-time of the departure during which the passengers checkout takes place
  // (Optional)
  @Prop()
  checkoutDelay?: number;

  // The scheduled date-time of the trip's departure
  @Prop({ type: Date, required: true })
  startsAt: Date;

  // The exact date-time when the trip's vehicle begins to start the trip
  @Prop({ type: Date, required: true })
  startedAt: Date;

  // The exact date-time when the trip's vehicle successfully arrives at the destination and mark the trip as completed
  // The value remains null until the trip is successfully completed
  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  @Prop({ type: MongooseSchema.ObjectId, ref: Vehicle.name, required: true })
  vehicle: Types.ObjectId | VehicleDocument;

  @Prop({
    type: [{ type: MongooseSchema.ObjectId, required: true }],
    ref: Driver.name,
    required: true,
  })
  drivers: Types.ObjectId[] | DriverDocument[];

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;
}

export const tripSchema = SchemaFactory.createForClass(Trip);

// Indexes (only the ongoing trips)
tripSchema.index(
  { cooperative: 1, drivers: 1 },
  { partialFilterExpression: { status: { $eq: TripStatus.Ongoing } } },
);
tripSchema.index(
  { cooperative: 1, vehicle: 1 },
  { partialFilterExpression: { status: { $eq: TripStatus.Ongoing } } },
);

export type TripDocument = HydratedDocument<Trip>;
export type TripModel = Model<Trip>;
