import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cooperative, cooperativeSchema } from './schema';
import { CooperativeService } from './cooperative.service';

const cooperativeMongooseModule = MongooseModule.forFeature([
  { name: Cooperative.name, schema: cooperativeSchema },
]);

@Module({
  imports: [cooperativeMongooseModule],
  exports: [cooperativeMongooseModule, CooperativeService],
  providers: [CooperativeService],
})
export class CooperativeModule {}
