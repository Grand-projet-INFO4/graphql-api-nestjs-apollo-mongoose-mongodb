import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SocialMedia, socialMediaSchema } from './schema';

const socialMediaMongooseModule = MongooseModule.forFeature([
  {
    name: SocialMedia.name,
    schema: socialMediaSchema,
  },
]);

@Module({
  imports: [socialMediaMongooseModule],
  exports: [socialMediaMongooseModule],
})
export class SocialMediaModule {}
