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
        // 5: Capital of Madagascar (Antananarivo)
        {
          _id: new mongo.ObjectId(),
          cityName: 'Antananarivo',
          alt: 'Tananarive',
          region: regionNameMap.get('Analamanga'),
          weight: 5,
        },
        // 4: Capital of provinces
        {
          _id: new mongo.ObjectId(),
          cityName: 'Toamasina',
          alt: 'Tamatave',
          region: regionNameMap.get('Atsinanana'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Toliara',
          alt: 'Tuléar',
          region: regionNameMap.get('Atsimo Andrefana'),
          weight: 4,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mahajanga',
          alt: 'Majunga',
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
          alt: 'Diego-Suarez',
          region: regionNameMap.get('Diana'),
          weight: 4,
        },
        // 3: Capital of regions
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
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 3,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Fenoarivo Atsinana',
          alt: 'Fénérive Est',
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
          alt: 'Fort-Dauphin',
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
        // 3: Chef-lieu districts
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambanja',
          region: regionNameMap.get('Diana'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambilobe',
          region: regionNameMap.get('Diana'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Vohimarina',
          alt: 'Vohémar',
          region: regionNameMap.get('Sava'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Antalaha',
          region: regionNameMap.get('Sava'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mampikony',
          region: regionNameMap.get('Sofia'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Boriziny',
          alt: 'Port-Bergé',
          region: regionNameMap.get('Sofia'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Befandriana Avaratra',
          alt: 'Befandriana Nord',
          region: regionNameMap.get('Sofia'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mandritsara',
          region: regionNameMap.get('Sofia'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Andilamena',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Amparafaravola',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Moramanga',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Vohibinany',
          alt: 'Brickaville',
          region: regionNameMap.get('Atsinanana'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Soanierana Ivongo',
          region: regionNameMap.get('Analanjirofo'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mananara Avaratra',
          alt: 'Mananara Nord',
          region: regionNameMap.get('Analanjirofo'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Maroantsetra',
          region: regionNameMap.get('Analanjirofo'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Arivonimamo',
          region: regionNameMap.get('Itasy'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ankazobe',
          region: regionNameMap.get('Analamanga'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Manjakandriana',
          region: regionNameMap.get('Analamanga'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Anjozorobe',
          region: regionNameMap.get('Analamanga'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambatolampy',
          region: regionNameMap.get('Vakinankaratra'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambatofinandrahana',
          region: regionNameMap.get("Amoron'i Mania"),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambohimahasoa',
          region: regionNameMap.get('Haute Matsiatra'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ifanadiana',
          region: regionNameMap.get('Vatovavy'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Manakara',
          region: regionNameMap.get('Fitovinany'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Vohipeno',
          region: regionNameMap.get('Fitovinany'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Vangaindrano',
          region: regionNameMap.get('Atsimo Atsinanana'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambalavao',
          region: regionNameMap.get('Haute Matsiatra'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Sakaraha',
          region: regionNameMap.get('Atsimo Andrefana'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Miandrivazo',
          region: regionNameMap.get('Menabe'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Betroka',
          region: regionNameMap.get('Anosy'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambovombe',
          region: regionNameMap.get('Androy'),
          weight: 2,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Amboasary-Atsimo',
          region: regionNameMap.get('Anosy'),
          weight: 2,
        },
        // 1: Small cities / Villages / Communes
        {
          _id: new mongo.ObjectId(),
          cityName: 'Imerintsiatosika',
          region: regionNameMap.get('Itasy'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Analavory',
          region: regionNameMap.get('Itasy'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Belobaka',
          region: regionNameMap.get('Bongolava'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ankadinondry Sakay',
          alt: 'Babetville',
          region: regionNameMap.get('Bongolava'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ampefy',
          region: regionNameMap.get('Itasy'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Ambondromamy',
          region: regionNameMap.get('Boeny'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Mahavelona',
          alt: 'Foulpointe',
          region: regionNameMap.get('Atsinanana'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Amboavory',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Tanambe',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Vohidiala',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Amboasary-Gara',
          alt: 'Amboasary Gare',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Morarano-Gara',
          alt: 'Morarano Gare',
          region: regionNameMap.get('Alaotra-Mangoro'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Malaimbandy',
          region: regionNameMap.get('Menabe'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Vohiparara',
          region: regionNameMap.get('Haute Matsiatra'),
          weight: 1,
        },
        {
          _id: new mongo.ObjectId(),
          cityName: 'Irondro',
          region: regionNameMap.get('Fitovinany'),
          weight: 1,
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
