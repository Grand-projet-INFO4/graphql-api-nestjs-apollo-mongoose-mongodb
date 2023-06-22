import { Module } from '@nestjs/common';

import { apiModules } from 'src/api';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: apiModules,
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
