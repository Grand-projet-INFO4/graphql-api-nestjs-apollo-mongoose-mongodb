import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { COOPERATIVE_PHOTOS_DIR } from './cooperative.constants';

@Injectable()
export class CooperativeService {
  constructor(private configService: ConfigService) {}

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
