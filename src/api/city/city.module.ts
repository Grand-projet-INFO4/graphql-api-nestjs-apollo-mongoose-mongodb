import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { City, citySchema } from './schema';
import { CityFieldExistsValidator } from './validator';
import { CityService } from './city.service';
import { CityResolver, EmbeddedCityResolver } from './resolver';

const CityMongooseModule = MongooseModule.forFeature([
  {
    name: City.name,
    schema: citySchema,
  },
]);

@Module({
  imports: [CityMongooseModule],
  providers: [
    CityFieldExistsValidator,
    CityService,
    CityResolver,
    EmbeddedCityResolver,
  ],
  exports: [CityMongooseModule, CityService],
})
export class CityModule {}
