import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusStation, busStationSchema } from './schema';
import { BusStationService } from './bus-station.service';
import { BusStationResolver } from './bus-station.resolver';
import { BusStationDataLoader } from './bus-station.dataloader';

const busStationModule = MongooseModule.forFeature([
  {
    name: BusStation.name,
    schema: busStationSchema,
  },
]);

@Module({
  imports: [busStationModule],
  exports: [busStationModule, BusStationService, BusStationDataLoader],
  providers: [BusStationService, BusStationResolver, BusStationDataLoader],
})
export class BusStationModule {}
