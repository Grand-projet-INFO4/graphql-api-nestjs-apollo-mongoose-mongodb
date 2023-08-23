import { Injectable } from '@nestjs/common';

// Exposes all the dataloaders through the `getLoaders()` method
@Injectable()
export class DataloaderService {
  getLoaders() {
    return {};
  }
}
