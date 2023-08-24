import { Injectable } from '@nestjs/common/decorators';
import { Connection, mongo } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Region, RegionModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as regionsByProvinceSeedsOptions from '../../../seed/region.seed.json';

type RegionsPerProvince = {
  province: string;
  regions: {
    regionName: string;
  }[];
};

export type RegionSeederPayload = WithMongoId<Region>;

@Injectable()
export class RegionSeeder implements Seeder {
  // The regions data to seed (singleton)
  private static regions: RegionSeederPayload[] | null = null;

  // Map of the regions names as keys and the region data as value (singleton)
  private static regionNameMap: Map<string, RegionSeederPayload> | null = null;

  constructor(
    @InjectModel(Region.name) private regionModel: RegionModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.regionModel.insertMany(RegionSeeder.getRegions());
    await session.commitTransaction();
    console.log('Seeded the `regions` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.regionModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('regions');
    await session.commitTransaction();
    console.log('Cleared the `regions` collection ...');
  }

  // Getters of the regions data singleton
  static getRegions(): RegionSeederPayload[] {
    if (!RegionSeeder.regions) {
      const regions: RegionSeederPayload[] = [];
      const provincesWithRegions: RegionsPerProvince[] =
        regionsByProvinceSeedsOptions;
      provincesWithRegions.forEach(({ province, regions: _regions }) => {
        _regions.forEach(({ regionName }) => {
          regions.push({
            _id: new mongo.ObjectId(),
            regionName,
            province,
          });
        });
      });
      RegionSeeder.regions = regions;
    }
    return RegionSeeder.regions;
  }

  // Getter of the regions names map singleton
  static getRegionNameMap() {
    if (!RegionSeeder.regionNameMap) {
      const regionNameMap = new Map<string, RegionSeederPayload>();
      const regions = RegionSeeder.getRegions();
      regions.forEach((region) => {
        regionNameMap.set(region.regionName, region);
      });
      RegionSeeder.regionNameMap = regionNameMap;
    }
    return RegionSeeder.regionNameMap;
  }
}
