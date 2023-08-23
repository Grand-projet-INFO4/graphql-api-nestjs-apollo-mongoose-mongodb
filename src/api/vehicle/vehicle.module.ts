import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  EmbeddedVehicle,
  Vehicle,
  embeddedVehicleSchema,
  vehicleSchema,
} from './schema';

const vehicleMongooseModule = MongooseModule.forFeature([
  {
    name: Vehicle.name,
    schema: vehicleSchema,
  },
]);

const embeddedVehicleMongooseModule = MongooseModule.forFeature([
  {
    name: EmbeddedVehicle.name,
    schema: embeddedVehicleSchema,
  },
]);

@Module({
  imports: [vehicleMongooseModule, embeddedVehicleMongooseModule],
  exports: [vehicleMongooseModule, embeddedVehicleMongooseModule],
})
export class VehicleModule {}
