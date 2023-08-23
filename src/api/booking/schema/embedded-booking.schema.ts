import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';

import {
  BookingMode,
  BookingPersonAttendance,
  bookingModes,
  bookingPersonAttendances,
} from '../booking.constants';
import { Payment, paymentSchema } from 'src/common/schemas/payment.schema';
import { ParkingLot, ParkingLotDocument } from 'src/api/parking-lot/schema';
import { User, UserDocument } from 'src/api/user/schema';
import { isValidSeat } from 'src/api/vehicle/helpers/is-valid-seat.helper';

@Schema({ timestamps: true, autoCreate: false })
export class EmbeddedBooking {
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
          return isValidSeat(value);
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

  // A hashed secret code made of 6 digits that is attached to the booking if its was done ONLINE
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

  // The id of the parking lot where the booking took place if it was done in person
  @Prop({ type: MongooseSchema.ObjectId, ref: ParkingLot.name })
  parkingLot?: Types.ObjectId | ParkingLotDocument;

  // The id of the user that booked the seats if it was done online by a registered user in the application
  @Prop({
    type: MongooseSchema.ObjectId,
    ref: User.name,
  })
  user?: Types.ObjectId | UserDocument;
}

export const embeddedBookingSchema =
  SchemaFactory.createForClass(EmbeddedBooking);

export type EmbeddedBookingDocument = HydratedDocument<EmbeddedBooking>;
export type EmbeddedBookingModel = Model<EmbeddedBooking>;
