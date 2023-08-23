import {
  Types,
  Schema as MongooseSchema,
  Model,
  HydratedDocument,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  EmbeddedBookingDocument,
  embeddedBookingSchema,
} from 'src/api/booking/schema';
import {
  EmbeddedRouteDocument,
  embeddedRouteSchema,
} from 'src/api/route/schema';
import { isValidSeat } from 'src/api/vehicle/helpers/is-valid-seat.helper';
import { TripPath, tripPathSchema } from 'src/api/trip/schema/trip-path.schema';
import {
  PlannedTripStatus,
  plannedTripStatuses,
} from '../planned-trip.constants';
import { Vehicle, VehicleDocument } from 'src/api/vehicle/schema';
import { Driver, DriverDocument } from 'src/api/driver/schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';

// The planned trips collection name
export const PLANNED_TRIP_COLLECTION = 'plannedTrips';

@Schema({ collection: PLANNED_TRIP_COLLECTION, timestamps: true })
export class PlannedTrip {
  @Prop({ type: embeddedRouteSchema, required: true })
  route: EmbeddedRouteDocument;

  @Prop({ type: tripPathSchema, required: true })
  path: TripPath;

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
    enum: plannedTripStatuses,
    default: PlannedTripStatus.Pending,
  })
  status: PlannedTripStatus;

  // Delay in minutes before the date-time of the departure during which the passengers checkout takes place
  // (Optional)
  @Prop()
  checkoutDelay?: number;

  // The scheduled date-time of the trip's departure
  @Prop({ type: Date, required: true })
  startsAt: Date;

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

export const plannedTripSchema = SchemaFactory.createForClass(PlannedTrip);

// Indexes
plannedTripSchema.index({ cooperative: 1, drivers: 1 });
plannedTripSchema.index({ cooperative: 1, vehicle: 1 });

export type PlannedTripDocument = HydratedDocument<PlannedTrip>;
export type PlannedTripModel = Model<PlannedTrip>;
