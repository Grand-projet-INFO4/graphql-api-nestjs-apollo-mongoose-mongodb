import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cooperative,
  CooperativePreferences,
  cooperativePreferencesSchema,
  cooperativeSchema,
} from './schema';

const cooperativeMongooseModule = MongooseModule.forFeature([
  { name: Cooperative.name, schema: cooperativeSchema },
]);
const cooperativePreferencesMongooseModule = MongooseModule.forFeature([
  { name: CooperativePreferences.name, schema: cooperativePreferencesSchema },
]);

@Module({
  imports: [cooperativeMongooseModule, cooperativePreferencesMongooseModule],
  exports: [cooperativeMongooseModule, cooperativePreferencesMongooseModule],
})
export class CooperativeModule {}
