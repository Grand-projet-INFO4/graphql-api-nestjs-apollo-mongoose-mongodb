import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CarModel, carModelSchema } from './schema';

const carModelMongooseModule = MongooseModule.forFeature([
  {
    name: CarModel.name,
    schema: carModelSchema,
  },
]);

@Module({
  imports: [carModelMongooseModule],
  exports: [carModelMongooseModule],
})
export class CarModelModule {}
