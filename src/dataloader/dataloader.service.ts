import { Injectable } from '@nestjs/common';
import { BusStationDataLoader } from 'src/api/bus-station/bus-station.dataloader';

import { CooperativeDataLoader } from 'src/api/cooperative/cooperative.dataloader';
import { PhotoDataLoader } from 'src/api/photo/photo.dataloader';

// Exposes all the dataloaders through the `getLoaders()` method
@Injectable()
export class DataloaderService {
  constructor(
    private cooperativeDataLoader: CooperativeDataLoader,
    private photoDataLoader: PhotoDataLoader,
    private busStationDataLoader: BusStationDataLoader,
  ) {}

  getLoaders() {
    return {
      cooperativeLoader: this.cooperativeDataLoader.getDataLoaders(),
      photoLoader: this.photoDataLoader.getDataLoaders(),
      busStationLoader: this.busStationDataLoader.getDataLoaders(),
    };
  }
}
