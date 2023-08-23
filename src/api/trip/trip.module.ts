import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Trip, tripSchema } from './schema';

export const tripModule = MongooseModule.forFeature([
  {
    name: Trip.name,
    schema: tripSchema,
  },
]);

@Module({
  imports: [tripModule],
  exports: [tripModule],
})
export class TripModule {}
