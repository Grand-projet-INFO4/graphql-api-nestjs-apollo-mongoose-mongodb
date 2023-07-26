import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { WithMongoId } from 'src/common/types/mongo-id';
import { Connection, mongo } from 'mongoose';

import { City, CityModel } from './schema';
import { RegionSeeder, RegionSeederPayload } from '../region/region.seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

export type CitySeederPayload = WithMongoId<
  Omit<City, 'region'> & {
    region: RegionSeederPayload;
  }
>;

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
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('cities');
    await session.commitTransaction();
    console.log('Cleared the `cities` collection ...');
  }

  static getCities() {
    if (!CitySeeder.cities) {
      const regionNameMap = RegionSeeder.getRegionNameMap();
      const cities: CitySeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          cityName: 'Antananarivo',
          region: regionNameMap.get('Analamanga'),
          weight: 5,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Toamasina',
          region: regionNameMap.get('Atsinanana'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Toliara',
          region: regionNameMap.get('Atsimo Andrefana'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mahajanga',
          region: regionNameMap.get('Boeny'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Fianarantsoa',
          region: regionNameMap.get('Haute Matsiatra'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Antsiranana',
          region: regionNameMap.get('Diana'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Antsirabe',
          region: regionNameMap.get('Vakinankaratra'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Miarinarivo',
          region: regionNameMap.get('Itasy'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Tsiroanomandidy',
          region: regionNameMap.get('Bongolava'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambatondrazaka',
          region: regionNameMap.get('Alaotra Mangoro'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Fenoarivo Atsinana',
          region: regionNameMap.get('Analanjirofo'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Antsohihy',
          region: regionNameMap.get('Sofia'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Maevatanàna',
          region: regionNameMap.get('Betsiboka'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Maintirano',
          region: regionNameMap.get('Melaky'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Taolagnaro',
          region: regionNameMap.get('Anosy'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambovombe',
          region: regionNameMap.get('Androy'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Morondava',
          region: regionNameMap.get('Menabe'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambositra',
          region: regionNameMap.get("Amoron'i Mania"),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mananjary',
          region: regionNameMap.get('Vatovavy'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Manakara',
          region: regionNameMap.get('Fitovinany'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Farafangana',
          region: regionNameMap.get('Atsimo Atsinanana'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ihosy',
          region: regionNameMap.get('Ihorombe'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Sambava',
          region: regionNameMap.get('Sava'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Moramanga',
          region: regionNameMap.get('Alaotra Mangoro'),
          weight: 2,
        },
      ];
      CitySeeder.cities = cities;
    }
    return CitySeeder.cities;
  }

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
}
