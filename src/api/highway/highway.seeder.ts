import { Connection, mongo } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { Highway, HighwayModel } from './schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { WithMongoId } from 'src/common/types/mongo-id';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as highwaySeedOptions from '../../../seed/highway.seed.json';

export type HighwaySeederPayload = WithMongoId<
  Omit<Highway, 'cities'> & { cities: CitySeederPayload[] }
>;

export class HighwaySeeder implements Seeder {
  // Singleton the highways data seed
  private static highways: HighwaySeederPayload[] | null = null;

  constructor(
    @InjectModel(Highway.name) private highwayModel: HighwayModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.highwayModel.insertMany(HighwaySeeder.getHighways());
    await session.commitTransaction();
    console.log('Seeded the `highways` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.highwayModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('highways');
    await session.commitTransaction();
    console.log('Cleared the `highways` collection ...');
  }

  /**
   * Getter for the highways data seed singleton
   */
  static getHighways(): HighwaySeederPayload[] {
    if (!HighwaySeeder.highways) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const highways = highwaySeedOptions.map<HighwaySeederPayload>(
        (options) => {
          const highway: HighwaySeederPayload = {
            _id: new mongo.ObjectId(),
            no: options.no,
            cities: options.cityNames.map<CitySeederPayload>((cityName) => {
              return cityNameMap.get(cityName);
            }),
          };
          options.distance && (highway.distance = options.distance);
          return highway;
        },
      );
      HighwaySeeder.highways = highways;
    }
    return HighwaySeeder.highways;
  }
}
