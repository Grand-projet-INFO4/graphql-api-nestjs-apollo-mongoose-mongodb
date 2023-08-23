import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Booking,
  EmbeddedBooking,
  bookingSchema,
  embeddedBookingSchema,
} from './schema';

const bookingMongooseModule = MongooseModule.forFeature([
  {
    name: Booking.name,
    schema: bookingSchema,
  },
]);

const embededBookingMongooseModule = MongooseModule.forFeature([
  {
    name: EmbeddedBooking.name,
    schema: embeddedBookingSchema,
  },
]);

@Module({
  imports: [bookingMongooseModule, embededBookingMongooseModule],
  exports: [bookingMongooseModule, embededBookingMongooseModule],
})
export class BookingModule {}
