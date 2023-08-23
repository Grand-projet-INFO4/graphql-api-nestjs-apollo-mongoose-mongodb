import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';

import {
  frontSeatRegExp,
  rearSeatRegExp,
} from 'src/api/vehicle/vehicle.constants';
import {
  BookingMode,
  BookingPersonAttendance,
  BookingStatus,
  bookingModes,
  bookingPersonAttendances,
  bookingStatuses,
} from '../booking.constants';
import { Payment, paymentSchema } from 'src/common/schemas/payment.schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import { ParkingLot, ParkingLotDocument } from 'src/api/parking-lot/schema';
import { User, UserDocument } from 'src/api/user/schema';

// The bookings collection name
export const BOOKING_COLLECTION = 'bookings';

@Schema({ timestamps: true })
export class Booking {
  // The name of the person whom the booking is attributed to
  @Prop({ type: String, required: true })
  personName: string;

  // The phone number of the attributed person that serves as the primary mean of contact for the cooperative
  @Prop({ type: String, required: true })
  phone: string;

  // Optional email address that can be used by the attributed person
  // to receive the snapshot of the ticket as well as updates about the trip
  @Prop()
  email?: string;

  // The seats that were booked
  @Prop({
    type: [
      {
        type: String,
        required: true,
        validate(value: string) {
          return frontSeatRegExp.test(value) || rearSeatRegExp.test(value);
        },
      },
    ],
    required: true,
  })
  seats: string[];

  @Prop({ type: String, required: true, enum: bookingModes })
  mode: BookingMode;

  // Payment details
  @Prop({ type: paymentSchema, required: true })
  payment: Payment;

  // A hashed secret code made of 6 digits that is attached to the booking if the booking was done ONLINE
  // This serves as password mechanism to ensure that authenticity of the attributed person during the checkout
  // The clear text of the secret code is sent to the attributed person through the provided phone number and/or the email address
  @Prop()
  secretCode?: string;

  // The attendance of the person that booked the trip to the departure's parking lot
  @Prop({
    type: String,
    required: true,
    enum: bookingPersonAttendances,
    default: BookingPersonAttendance.Waiting,
  })
  attendance: BookingPersonAttendance;

  @Prop({
    type: String,
    required: true,
    enum: bookingStatuses,
    default: BookingStatus.Pending,
  })
  status: BookingStatus;

  // The planned trip associated with the booking if the trip has not started yet
  @Prop({ type: MongooseSchema.ObjectId, ref: 'PlannedTrip' })
  plannedTrip?: Types.ObjectId;

  // The trip associated with the booking if the trip has already started i.e ongoing or finished
  @Prop({ type: MongooseSchema.ObjectId, ref: 'Trip' })
  trip?: Types.ObjectId;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;

  // The id of the parking lot where the booking took place if it was done in person
  @Prop({ type: MongooseSchema.ObjectId, ref: ParkingLot.name })
  parkingLot?: Types.ObjectId | ParkingLotDocument;

  // The id of the user that booked the seats if it was done online by a registered user in the application
  @Prop({
    type: MongooseSchema.ObjectId,
    ref: User.name,
    index: true,
    sparse: true,
  })
  user?: Types.ObjectId | UserDocument;
}

export const bookingSchema = SchemaFactory.createForClass(Booking);

// Indexes
bookingSchema.index({ cooperative: 1, plannedTrip: 1 }, { sparse: true });
bookingSchema.index({ cooperative: 1, parkingLot: 1 }, { sparse: true });
bookingSchema.index({ personName: 'text' });

export type BookingDocument = HydratedDocument<Booking>;
export type BookingModel = Model<Booking>;
