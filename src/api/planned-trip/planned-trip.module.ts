import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlannedTrip, plannedTripSchema } from './schema';

const plannedTripMongooseModule = MongooseModule.forFeature([
  {
    name: PlannedTrip.name,
    schema: plannedTripSchema,
  },
]);

@Module({
  imports: [plannedTripMongooseModule],
  exports: [plannedTripMongooseModule],
})
export class PlannedTripModule {}
