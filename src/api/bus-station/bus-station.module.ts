import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusStation, busStationSchema } from './schema';
import { BusStationService } from './bus-station.service';
import { BusStationResolver } from './bus-station.resolver';

const busStationModule = MongooseModule.forFeature([
  {
    name: BusStation.name,
    schema: busStationSchema,
  },
]);

@Module({
  imports: [busStationModule],
  exports: [busStationModule],
  providers: [BusStationService, BusStationResolver],
})
export class BusStationModule {}
