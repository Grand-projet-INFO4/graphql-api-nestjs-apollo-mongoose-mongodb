import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Photo, photoSchema } from './schema';
import {
  CooperativePhoto,
  cooperativePhotoSchema,
} from './schema/cooperative-photo.schema';
import { CooperativePhotoResolver } from './resolver';
import { PhotoService } from './photo.service';
import { PhotoDataLoader } from './photo.dataloader';

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
  providers: [CooperativePhotoResolver, PhotoService, PhotoDataLoader],
  exports: [photoMongooseModule, PhotoService, PhotoDataLoader],
})
export class PhotoModule {}
