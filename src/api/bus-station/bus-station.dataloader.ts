import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as DataLoader from 'dataloader';

import { BatchOneFn, HasDataLoaders } from 'src/dataloader/dataloader';
import { BusStation, BusStationDocument, BusStationModel } from './schema';

@Injectable()
export class BusStationDataLoader implements HasDataLoaders {
  constructor(
    @InjectModel(BusStation.name) private busStationModel: BusStationModel,
  ) {}

  getDataLoaders() {
    return {
      busStationHavingId: new DataLoader(this.batchBusStationHavingId),
    };
  }

  batchBusStationHavingId: BatchOneFn<
    BusStationDocument,
    Types.ObjectId | string
  > = async (ids) => {
    const busStations = await this.busStationModel.find({ _id: { $in: ids } });
    const busStationMap = new Map<string, BusStationDocument>();
    for (const busStation of busStations) {
      busStationMap.set(busStation.id, busStation);
    }
    return ids.map((id) => busStationMap.get(id.toString() ?? null));
  };
}
