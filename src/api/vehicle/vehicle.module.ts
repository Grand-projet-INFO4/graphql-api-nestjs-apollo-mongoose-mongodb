import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Vehicle, vehicleSchema } from './schema';

const vehicleMongooseModule = MongooseModule.forFeature([
  {
    name: Vehicle.name,
    schema: vehicleSchema,
  },
]);

@Module({
  imports: [vehicleMongooseModule],
  exports: [vehicleMongooseModule],
})
export class VehicleModule {}
