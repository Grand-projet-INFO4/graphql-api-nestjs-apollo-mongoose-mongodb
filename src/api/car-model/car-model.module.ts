import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CarModel,
  EmbeddedCarModel,
  carModelSchema,
  embeddedCarModelSchema,
} from './schema';

const carModelMongooseModule = MongooseModule.forFeature([
  {
    name: CarModel.name,
    schema: carModelSchema,
  },
]);

const embeddedCarModelMongooseModule = MongooseModule.forFeature([
  {
    name: EmbeddedCarModel.name,
    schema: embeddedCarModelSchema,
  },
]);

@Module({
  imports: [carModelMongooseModule, embeddedCarModelMongooseModule],
  exports: [carModelMongooseModule, embeddedCarModelMongooseModule],
})
export class CarModelModule {}
