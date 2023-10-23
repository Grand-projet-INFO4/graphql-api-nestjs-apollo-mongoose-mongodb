import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { COOPERATIVE_PHOTOS_DIR } from './cooperative.constants';
import { Cooperative, CooperativeModel } from './schema';

@Injectable()
export class CooperativeService {
  constructor(
    @InjectModel(Cooperative.name) private cooperativeModel: CooperativeModel,
    private configService: ConfigService,
  ) {}

  /**
   * Gets a cooperative by one its identifier fields's value
   *
   * @param identifier The identifier field's value. It could represent the id or the slug.
   */
  async getOne(identifier: Types.ObjectId | string) {
    const filters: FilterQuery<Cooperative> =
      typeof identifier === 'string'
        ? { $or: [{ _id: identifier }, { slug: identifier }] }
        : { _id: identifier };
    const cooperative = await this.cooperativeModel.findOne(filters);
    if (!cooperative) {
      throw new NotFoundException('Could not find the cooperative');
    }
    return cooperative;
  }

  /**
   * Gets the full URL path of a cooperative photo from its filename
   *
   * @param filename The filename of the photo
   */
  getCooperativePhotoURL(filename: string): string {
    return (
      this.configService.get('APP_URL') +
      [
        STATIC_FILES_URL_PREFIX,
        IMAGES_DIR,
        COOPERATIVE_PHOTOS_DIR,
        filename,
      ].join('/')
    );
  }
}
