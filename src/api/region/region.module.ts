import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  EmbeddedRegion,
  Region,
  embeddedRegionSchema,
  regionSchema,
} from './schema';

const regionMongooseModule = MongooseModule.forFeature([
  {
    name: Region.name,
    schema: regionSchema,
  },
]);

const embeddedRegionMongooseModule = MongooseModule.forFeature([
  {
    name: EmbeddedRegion.name,
    schema: embeddedRegionSchema,
  },
]);

@Module({
  imports: [regionMongooseModule, embeddedRegionMongooseModule],
  providers: [],
  exports: [regionMongooseModule, embeddedRegionMongooseModule],
})
export class RegionModule {}
