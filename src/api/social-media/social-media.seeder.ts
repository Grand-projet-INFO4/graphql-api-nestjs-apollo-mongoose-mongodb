import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';

import { WithMongoId } from 'src/common/types/mongo-id';
import { SocialMedia, SocialMediaModel } from './schema';
import { mongo } from 'mongoose';
import { SocialMediaPlatform } from './social-media.constants';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

export type SocialMediaSeederPayload = WithMongoId<SocialMedia>;

@Injectable()
export class SocialMediaSeeder implements Seeder {
  // Social medias seed data singleton
  private static socialMedias: SocialMediaSeederPayload[] | null = null;

  constructor(
    @InjectModel(SocialMedia.name) private socialMediaModel: SocialMediaModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.socialMediaModel.insertMany(SocialMediaSeeder.getSocialMedias());
    await session.commitTransaction();
    console.log('Seeded the the `socialMedias` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.socialMediaModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('socialMedias');
    await session.commitTransaction();
    console.log('Cleared the the `socialMedias` collection ...');
  }

  /**
   * Getter for the social medias seed data singleton
   */
  static getSocialMedias(): SocialMediaSeederPayload[] {
    if (!SocialMediaSeeder.socialMedias) {
      const socialMedias: SocialMediaSeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          platform: SocialMediaPlatform.Facebook,
          url: 'https://www.facebook.com/',
          logo: 'facebook_logo.svg',
        },
        {
          _id: new mongo.ObjectId(),
          platform: SocialMediaPlatform.Instagram,
          url: 'https://www.instagram.com/',
          logo: 'instagram_logo.svg',
        },
        {
          _id: new mongo.ObjectId(),
          platform: SocialMediaPlatform.Twitter,
          url: 'https://twitter.com/',
          logo: 'twitter_logo.svg',
        },
        {
          _id: new mongo.ObjectId(),
          platform: SocialMediaPlatform.TikTok,
          url: 'https://www.tiktok.com',
          logo: 'tiktok_logo.svg',
        },
      ];
      SocialMediaSeeder.socialMedias = socialMedias;
    }
    return SocialMediaSeeder.socialMedias;
  }
}
