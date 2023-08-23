import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Highway, highwaySchema } from './schema';

const highwayMongooseModule = MongooseModule.forFeature([
  {
    name: Highway.name,
    schema: highwaySchema,
  },
]);

@Module({
  imports: [highwayMongooseModule],
  exports: [highwayMongooseModule],
})
export class HighwayModule {}
