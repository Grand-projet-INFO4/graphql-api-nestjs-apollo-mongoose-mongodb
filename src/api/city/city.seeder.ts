import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { WithMongoId } from 'src/common/types/mongo-id';
import { Connection, mongo } from 'mongoose';

import { City, CityModel } from './schema';
import { RegionSeeder, RegionSeederPayload } from '../region/region.seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as citiesByWeightSeeds from '../../../seed/city.seed.json';
import { EmbeddedCitySeed } from './city';
import { WithoutTimestamps } from 'src/common/types/timestamps';

export type CitySeederPayload = WithMongoId<
  WithoutTimestamps<
    Omit<City, 'region'> & {
      region: RegionSeederPayload;
    }
  >
>;

type CitiesByWeightSeedOptions = {
  weight: number;
  cities: {
    cityName: string;
    alt?: string;
    regionName: string;
  }[];
};

@Injectable()
export class CitySeeder implements Seeder {
  private static cities: CitySeederPayload[] | null = null;

  private static cityNameMap: Map<string, CitySeederPayload> | null = null;

  constructor(
    @InjectModel(City.name) private cityModel: CityModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.cityModel.insertMany(CitySeeder.getCities());
    await session.commitTransaction();
    console.log('Seeded the `cities` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.cityModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('cities');
    await session.commitTransaction();
    console.log('Cleared the `cities` collection ...');
  }

  static getCities() {
    if (!CitySeeder.cities) {
      const regionNameMap = RegionSeeder.getRegionNameMap();
      const cities: CitySeederPayload[] = [];
      const citiesByWeightSeedsOptions =
        citiesByWeightSeeds as CitiesByWeightSeedOptions[];
      for (const options of citiesByWeightSeedsOptions) {
        for (const cityOptions of options.cities) {
          const city: CitySeederPayload = {
            _id: new mongo.ObjectId(),
            cityName: cityOptions.cityName,
            weight: options.weight,
            region: regionNameMap.get(cityOptions.regionName),
          };
          cityOptions.alt && (city.alt = cityOptions.alt);
          cities.push(city);
        }
      }
      CitySeeder.cities = cities;
    }
    return CitySeeder.cities;
  }

  /**
   * Getter for the city name map by city name singleton
   */
  static getCityNameMap() {
    if (!CitySeeder.cityNameMap) {
      const cityNameMap = new Map<string, CitySeederPayload>();
      const cities = CitySeeder.getCities();
      for (const city of cities) {
        cityNameMap.set(city.cityName, city);
      }
      CitySeeder.cityNameMap = cityNameMap;
    }
    return CitySeeder.cityNameMap;
  }

  /**
   * Parses a city seed data into its embedded city seed data version
   *
   * @param city The city seed data
   * @param params Params
   */
  static parseEmbeddedCity(
    city: CitySeederPayload,
    params: { withWeight?: boolean },
  ) {
    const _city: EmbeddedCitySeed = {
      _id: city._id,
      cityName: city.cityName,
      region: city.region,
    };
    city.alt && (_city.alt = city.alt);
    params.withWeight && (_city.weight = city.weight);
    return _city;
  }
}
