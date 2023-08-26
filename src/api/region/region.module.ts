import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Region, regionSchema } from './schema';
import { RegionResolver } from './region.resolver';
import { RegionService } from './region.service';

const regionMongooseModule = MongooseModule.forFeature([
  {
    name: Region.name,
    schema: regionSchema,
  },
]);

@Module({
  imports: [regionMongooseModule],
  providers: [RegionResolver, RegionService],
  exports: [regionMongooseModule],
})
export class RegionModule {}
