import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { USERS_PHOTOS_DIR } from './user.constants';
import { User, UserDocument, UserModel } from './schema';
import { slugify } from 'src/common/utils/string.utils';
import { getRandomInteger } from 'src/common/utils/number.utils';

// The maximum count of possible similar usernames
const MAX_EQUAL_USERNAMES_COUNT = 99_999;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private config: ConfigService,
  ) {}

  async getOne(
    identifier: Types.ObjectId | string | number,
    field: '_id' | 'username' | 'email' = '_id',
  ) {
    const user = await this.userModel.findOne({
      [field]: identifier,
    });
    if (!user) {
      throw new NotFoundException('The user does not exist');
    }
    return user;
  }

  async delete(user: UserDocument) {
    await this.userModel.deleteOne({ _id: user.id });
    return user;
  }

  /**
   * Gets a unique username from the first name and a last name
   */
  async getUniqueUsername(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const username = `${slugify(firstName)}.${slugify(lastName)}`;
    const userStartingWithUsername = await this.userModel.findOne({
      username: {
        $regex: new RegExp(`^${username}`, 'i'),
      },
    });
    let isUniqueUsername: boolean = userStartingWithUsername === null;
    while (!isUniqueUsername) {
      // Trying a combination of the base username with a random count
      // until we get a non-taken username
      const usernameTry = `${username}.${getRandomInteger(
        MAX_EQUAL_USERNAMES_COUNT,
      )}`;
      isUniqueUsername = !(await this.userModel.findOne({
        username: usernameTry,
      }));
    }
    return username;
  }

  /**
   * Gets the full URL path to a user's photo
   *
   * @param photo The filename of the user's photo
   * @retun The full URL of the photo
   */
  getPhotoURL(photo: string | null): string | null {
    if (photo === null) return null;
    return (
      this.config.get('APP_URL') +
      STATIC_FILES_URL_PREFIX +
      '/' +
      IMAGES_DIR +
      '/' +
      USERS_PHOTOS_DIR +
      '/' +
      photo
    );
  }
}
