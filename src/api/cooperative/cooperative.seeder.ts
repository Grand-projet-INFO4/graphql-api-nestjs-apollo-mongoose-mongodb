import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';

import { WithMongoId } from 'src/common/types/mongo-id';
import { Cooperative, CooperativeModel } from './schema';
import { CooperativePreferencesSeed } from './cooperative';
import { SocialMediaLinkSeed } from '../social-media/social-media';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { SocialMediaLink } from '../social-media/schema';
import * as cooperativeSeedsOptions from '../../../seed/cooperative.seed.json';

export type CooperativeSeederPayload = Omit<
  WithMongoId<Cooperative>,
  'preferences' | 'socialMedias' | 'city'
> & {
  preferences: CooperativePreferencesSeed;
  socialMedias: SocialMediaLinkSeed[];
  city: CitySeederPayload;
};

type CooperativeSeedOptions = Omit<
  Cooperative,
  'preferences' | 'socialMedias' | 'city'
> & {
  socialMedias: SocialMediaLink[];
  cityName: string;
};

@Injectable()
export class CooperativeSeeder implements Seeder {
  // Cooperatives seed data singleton
  private static cooperatives: CooperativeSeederPayload[] | null = null;

  // Singleton of a map of cooperatives seed data with the slug as the key
  private static cooperativeSlugMap: Map<
    string,
    CooperativeSeederPayload
  > | null = null;

  constructor(
    @InjectModel(Cooperative.name) private cooperativeModel: CooperativeModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.cooperativeModel.insertMany(CooperativeSeeder.getCooperatives());
    await session.commitTransaction();
    console.log('Seeded the `cooperatives` table ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.cooperativeModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('cooperatives');
    await session.commitTransaction();
    console.log('Cleared the `cooperatives` table ...');
  }

  // Getter for the cooperatives seed data singleton
  static getCooperatives() {
    if (!CooperativeSeeder.cooperatives) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const cooperativesSeedsOptions =
        cooperativeSeedsOptions as CooperativeSeedOptions[];
      const cooperatives =
        cooperativesSeedsOptions.map<CooperativeSeederPayload>((options) => {
          const cooperative: CooperativeSeederPayload = {
            _id: new mongo.ObjectId(),
            coopName: options.coopName,
            slug: options.slug,
            address: options.address,
            highways: options.highways,
            phones: options.phones,
            profilePhoto: options.profilePhoto,
            zone: options.zone,
            city: cityNameMap.get(options.cityName),
            preferences: {
              _id: new mongo.ObjectId(),
            },
            socialMedias: options.socialMedias.map<SocialMediaLinkSeed>(
              (socialMedia) => ({
                _id: new mongo.ObjectId(),
                ...socialMedia,
              }),
            ),
          };
          options.coverPhoto && (cooperative.coverPhoto = options.coverPhoto);
          options.email && (cooperative.email = options.email);
          options.transparentLogo &&
            (cooperative.transparentLogo = options.transparentLogo);
          options.description &&
            (cooperative.description = options.description);
          return cooperative;
        });
      CooperativeSeeder.cooperatives = cooperatives;
    }
    return CooperativeSeeder.cooperatives;
  }

  /**
   * Getter for the cooperatives slug map singleton
   */
  static getCooperativesSlugMap() {
    if (!CooperativeSeeder.cooperativeSlugMap) {
      const cooperativeSlugMap = new Map<string, CooperativeSeederPayload>();
      for (const cooperative of CooperativeSeeder.getCooperatives()) {
        cooperativeSlugMap.set(cooperative.slug, cooperative);
      }
      CooperativeSeeder.cooperativeSlugMap = cooperativeSlugMap;
    }
    return CooperativeSeeder.cooperativeSlugMap;
  }
}
