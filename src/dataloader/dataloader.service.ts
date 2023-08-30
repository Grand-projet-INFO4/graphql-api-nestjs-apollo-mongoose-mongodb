import { Injectable } from '@nestjs/common';

import { CooperativeDataLoader } from 'src/api/cooperative/cooperative.dataloader';

// Exposes all the dataloaders through the `getLoaders()` method
@Injectable()
export class DataloaderService {
  constructor(private cooperativeDataLoader: CooperativeDataLoader) {}

  getLoaders() {
    return {
      cooperativeLoader: this.cooperativeDataLoader.getDataLoaders(),
    };
  }
}
