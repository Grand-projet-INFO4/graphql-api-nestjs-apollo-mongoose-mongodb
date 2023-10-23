import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Trip, tripSchema } from './schema';
import { TripResolver } from './trip.resolver';
import { TripService } from './trip.service';

export const tripModule = MongooseModule.forFeature([
  {
    name: Trip.name,
    schema: tripSchema,
  },
]);

@Module({
  imports: [tripModule],
  providers: [TripResolver, TripService],
  exports: [tripModule, TripService],
})
export class TripModule {}
