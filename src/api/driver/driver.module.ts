import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, TripDriver, driverSchema, tripDriverSchema } from './schema';

const driverMongooseModule = MongooseModule.forFeature([
  {
    name: Driver.name,
    schema: driverSchema,
  },
]);

const tripDriverMongooseModule = MongooseModule.forFeature([
  {
    name: TripDriver.name,
    schema: tripDriverSchema,
  },
]);

@Module({
  imports: [driverMongooseModule, tripDriverMongooseModule],
  exports: [driverMongooseModule, tripDriverMongooseModule],
})
export class DriverModule {}
