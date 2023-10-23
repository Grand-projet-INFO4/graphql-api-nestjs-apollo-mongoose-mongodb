import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CooperativePhotoDocument } from '../schema';
import { PhotoService } from '../photo.service';

@Resolver('CooperativePhoto')
export class CooperativePhotoResolver {
  constructor(private photoService: PhotoService) {}

  @ResolveField('id')
  getId(@Parent() photo: CooperativePhotoDocument) {
    return photo._id.toString();
  }

  @ResolveField('url')
  getURL(@Parent() photo: CooperativePhotoDocument) {
    return this.photoService.getCooperativePhotoURL(photo.filename);
  }
}
