import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Region, regionSchema } from './schema';

const regionMongooseModule = MongooseModule.forFeature([
  {
    name: Region.name,
    schema: regionSchema,
  },
]);

@Module({
  imports: [regionMongooseModule],
  providers: [],
  exports: [regionMongooseModule],
})
export class RegionModule {}
