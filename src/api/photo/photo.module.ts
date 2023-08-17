import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  EmbeddedPhoto,
  Photo,
  embeddedPhotoSchema,
  photoSchema,
} from './schema';
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

const embeddedPhotoMongooseModule = MongooseModule.forFeature([
  { name: EmbeddedPhoto.name, schema: embeddedPhotoSchema },
]);

@Module({
  imports: [photoMongooseModule, embeddedPhotoMongooseModule],
  exports: [photoMongooseModule, embeddedPhotoMongooseModule],
})
export class PhotoModule {}
