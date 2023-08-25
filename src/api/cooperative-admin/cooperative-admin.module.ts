import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CooperativeAdmin, cooperativeAdminSchema } from './schema';

const cooperativeAdminMongooseModule = MongooseModule.forFeature([
  {
    name: CooperativeAdmin.name,
    schema: cooperativeAdminSchema,
  },
]);

@Module({
  imports: [cooperativeAdminMongooseModule],
  exports: [cooperativeAdminMongooseModule],
})
export class CooperativeAdminModule {}
