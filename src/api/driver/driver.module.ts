import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, driverSchema } from './schema';

const driverMongooseModule = MongooseModule.forFeature([
  {
    name: Driver.name,
    schema: driverSchema,
  },
]);

@Module({
  imports: [driverMongooseModule],
  exports: [driverMongooseModule],
})
export class DriverModule {}
