import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { COOPERATIVE_PHOTOS_DIR } from '../cooperative/cooperative.constants';

@Injectable()
export class PhotoService {
  constructor(private configService: ConfigService) {}

  /**
   * Gets the full URL of a cooperative photo from the photo's filename
   */
  getCooperativePhotoURL(filename) {
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
