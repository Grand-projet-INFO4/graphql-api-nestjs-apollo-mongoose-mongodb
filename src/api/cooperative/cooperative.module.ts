import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cooperative, cooperativeSchema } from './schema';

const cooperativeMongooseModule = MongooseModule.forFeature([
  { name: Cooperative.name, schema: cooperativeSchema },
]);

@Module({
  imports: [cooperativeMongooseModule],
  exports: [cooperativeMongooseModule],
})
export class CooperativeModule {}
