import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cooperative, cooperativeSchema } from './schema';
import { CooperativeService } from './cooperative.service';
import { CooperativeDataLoader } from './cooperative.dataloader';
import { CooperativeResolver } from './cooperative.resolver';

const cooperativeMongooseModule = MongooseModule.forFeature([
  { name: Cooperative.name, schema: cooperativeSchema },
]);

@Module({
  imports: [cooperativeMongooseModule],
  exports: [
    cooperativeMongooseModule,
    CooperativeService,
    CooperativeDataLoader,
  ],
  providers: [CooperativeService, CooperativeDataLoader, CooperativeResolver],
})
export class CooperativeModule {}
