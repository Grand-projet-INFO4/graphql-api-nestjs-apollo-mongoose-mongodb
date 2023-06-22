import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { USERS_PHOTOS_DIR } from './user.constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getOne(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier },
          { username: identifier },
        ],
      },
    });
    if (!user) {
      throw new NotFoundException('The user does not exist');
    }
    return user;
  }

  async delete(user: User) {
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return user;
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
