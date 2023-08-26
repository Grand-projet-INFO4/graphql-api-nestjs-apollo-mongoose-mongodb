import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Highway, highwaySchema } from './schema';
import { HighwayResolver } from './highway.resolver';
import { HighwayService } from './highway.service';

const highwayMongooseModule = MongooseModule.forFeature([
  {
    name: Highway.name,
    schema: highwaySchema,
  },
]);

@Module({
  imports: [highwayMongooseModule],
  exports: [highwayMongooseModule],
  providers: [HighwayResolver, HighwayService],
})
export class HighwayModule {}
