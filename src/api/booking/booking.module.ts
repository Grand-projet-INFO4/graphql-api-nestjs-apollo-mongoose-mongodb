import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Booking, bookingSchema } from './schema';

const bookingMongooseModule = MongooseModule.forFeature([
  {
    name: Booking.name,
    schema: bookingSchema,
  },
]);

@Module({
  imports: [bookingMongooseModule],
  exports: [bookingMongooseModule],
})
export class BookingModule {}
