import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Vehicle, vehicleSchema } from './schema';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleService } from './vehicle.service';

const vehicleMongooseModule = MongooseModule.forFeature([
  {
    name: Vehicle.name,
    schema: vehicleSchema,
  },
]);

@Module({
  imports: [vehicleMongooseModule],
  providers: [VehicleResolver, VehicleService],
  exports: [vehicleMongooseModule, VehicleService],
})
export class VehicleModule {}
