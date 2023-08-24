import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Photo, photoSchema } from './schema';
import {
  CooperativePhoto,
  cooperativePhotoSchema,
} from './schema/cooperative-photo.schema';

const photoMongooseModule = MongooseModule.forFeature([
  {
    name: Photo.name,
    schema: photoSchema,
    discriminators: [
      { name: CooperativePhoto.name, schema: cooperativePhotoSchema },
    ],
  },
]);

@Module({
  imports: [photoMongooseModule],
  exports: [photoMongooseModule],
})
export class PhotoModule {}
