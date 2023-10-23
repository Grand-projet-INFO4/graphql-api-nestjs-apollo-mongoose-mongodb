import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlannedTrip, plannedTripSchema } from './schema';
import { PlannedTripResolver } from './planned-trip.resolver';
import { PlannedTripService } from './planned-trip.service';
import { VehicleModule } from '../vehicle/vehicle.module';

const plannedTripMongooseModule = MongooseModule.forFeature([
  {
    name: PlannedTrip.name,
    schema: plannedTripSchema,
  },
]);

@Module({
  imports: [plannedTripMongooseModule, VehicleModule],
  providers: [PlannedTripResolver, PlannedTripService],
  exports: [plannedTripMongooseModule, PlannedTripService],
})
export class PlannedTripModule {}
