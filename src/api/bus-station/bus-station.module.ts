import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusStation, busStationSchema } from './schema';

const busStationModule = MongooseModule.forFeature([
  {
    name: BusStation.name,
    schema: busStationSchema,
  },
]);

@Module({
  imports: [busStationModule],
  exports: [busStationModule],
})
export class BusStationModule {}
