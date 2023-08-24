import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { mongo } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { WithMongoId } from 'src/common/types/mongo-id';
import { SocialMedia, SocialMediaModel } from './schema';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as socialMediasSeedsOptions from '../../../seed/social-media.seed.json';

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
      const socialMedias =
        socialMediasSeedsOptions.map<SocialMediaSeederPayload>(
          (socialMedia) => ({
            _id: new mongo.ObjectId(),
            ...(socialMedia as SocialMedia),
          }),
        );
      SocialMediaSeeder.socialMedias = socialMedias;
    }
    return SocialMediaSeeder.socialMedias;
  }
}
