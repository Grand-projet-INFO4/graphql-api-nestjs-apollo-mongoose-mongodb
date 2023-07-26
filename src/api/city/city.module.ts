import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { City, EmbeddedCity, citySchema, embeddedCitySchema } from './schema';
import { CityFieldExistsValidator } from './validator';
import { CityService } from './city.service';

const CityMongooseModule = MongooseModule.forFeature([
  {
    name: City.name,
    schema: citySchema,
  },
]);

const EmbeddedCityMongooseModule = MongooseModule.forFeature([
  {
    name: EmbeddedCity.name,
    schema: embeddedCitySchema,
  },
]);

@Module({
  imports: [CityMongooseModule, EmbeddedCityMongooseModule],
  providers: [CityFieldExistsValidator, CityService],
  exports: [CityMongooseModule, EmbeddedCityMongooseModule, CityService],
})
export class CityModule {}
