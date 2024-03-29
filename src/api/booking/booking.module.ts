import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Booking, bookingSchema } from './schema';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { PlannedTripModule } from '../planned-trip/planned-trip.module';

const bookingMongooseModule = MongooseModule.forFeature([
  {
    name: Booking.name,
    schema: bookingSchema,
  },
]);

@Module({
  imports: [bookingMongooseModule, PlannedTripModule],
  providers: [BookingResolver, BookingService],
  exports: [bookingMongooseModule, BookingService],
})
export class BookingModule {}
