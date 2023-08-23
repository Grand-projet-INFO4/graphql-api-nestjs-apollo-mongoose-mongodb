import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';

import {
  PARKING_LOT_COLLECTION,
  ParkingLot,
  ParkingLotModel,
} from './schema/parking-lot.schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { BusStationSeeder } from '../bus-station/bus-station.seeder';
import { ReplaceFields } from 'src/common/types/utils';
import { GeoJSONPoint } from 'src/common/schemas/geojson-point.schema';
import { PhotoSeeder } from '../photo/photo.seeder';
import { EmbeddedParkingLotSeed } from './parking-lot';
import { City, CityModel } from '../city/schema';

export type ParkingLotSeederPayload = WithMongoId<
  ReplaceFields<
    ParkingLot,
    {
      city: CitySeederPayload;
      mainPhoto?: mongo.BSON.ObjectId;
      busStation?: mongo.BSON.ObjectId;
      cooperative: mongo.BSON.ObjectId;
    }
  >
>;

type CooperativeParkingLotSeed = {
  cooperativeId: mongo.BSON.ObjectId;
  parkingLots: Omit<ParkingLotSeederPayload, 'cooperative'>[];
};

export class ParkingLotSeeder implements Seeder {
  // The parking lots seed data singleton
  private static parkingLots: ParkingLotSeederPayload[] | null = null;

  // Map of cooperative id - parking lot address combination and parking lot seed data value singleton
  private static parkingLotMap: Map<string, ParkingLotSeederPayload> | null =
    null;

  // Map of parking lot id key and parking lot seed data value singleton
  private static parkingLotMapById: Map<
    string,
    ParkingLotSeederPayload
  > | null = null;

  constructor(
    @InjectModel(ParkingLot.name) private parkingLotModel: ParkingLotModel,
    @InjectModel(City.name) private cityModel: CityModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.parkingLotModel.insertMany(ParkingLotSeeder.getParkingLots());
    await session.commitTransaction();
    console.log(`Seeded the \`${PARKING_LOT_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.parkingLotModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.parkingLotModel.db.dropCollection(PARKING_LOT_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${PARKING_LOT_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the parking lots seed data singleton
   */
  static getParkingLots() {
    if (!ParkingLotSeeder.parkingLots) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const cooperativeSlugMap = CooperativeSeeder.getCooperativesSlugMap();
      const busStationSlugMap = BusStationSeeder.getBusStationSlugMap();
      const parkingLots: ParkingLotSeederPayload[] = [];
      const data: CooperativeParkingLotSeed[] = [
        {
          cooperativeId: cooperativeSlugMap.get('trans-vatsi')._id,
          parkingLots: [
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address:
                'Rue Dr Raboto Raphael, Manjakaray, Antananarivo, Madagascar',
              position: new GeoJSONPoint([
                47.532035437419175, -18.892228774319,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0340419098'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Toamasina'),
              address: "Boulevard d'Andovoranto, Toamasina, Madagascar",
              locationHint: `En face de l'hôtel Beryl`,
              position: new GeoJSONPoint([
                49.404341282158974, -18.149423071732233,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0340419098'],
            },
          ],
        },
        {
          cooperativeId: cooperativeSlugMap.get('kofmad')._id,
          parkingLots: [
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address:
                'Gare routière MAKI, Andohatapenaka, Antananarivo, Madagascar',
              locationHint: 'Box 66',
              position: new GeoJSONPoint([
                47.49623596424636, -18.897706583027308,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('gare-routiere-maki')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address: "Fasan'ny karàna, Antananarivo, Madagascar",
              position: new GeoJSONPoint([
                47.51584465461535, -18.946165926868513,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('fasankarana')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Mahajanga'),
              address: 'Avenue Barday, Mahajanga, Madagascar',
              position: new GeoJSONPoint([
                47.515919756476, -18.945980733225966,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('gare-routiere-aranta')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antsiranana'),
              address: 'Gare routière Scama, Antsiranana, Madagascar',
              position: new GeoJSONPoint([49.2946676, -12.3232363]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('gare-routiere-antsiranana')
                ._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Fianarantsoa'),
              address: 'Gare routière du Sud, Fianarantsoa, Madagascar',
              position: new GeoJSONPoint([47.0905985, -21.4526948]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get(
                'gare-routiere-sud-fianarantsoa',
              )._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Morondava'),
              address: 'Gare routière, Morondava, Madagascar',
              position: new GeoJSONPoint([
                44.2763490472111, -20.29071693843428,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('gare-routiere-morondava')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Manakara'),
              address: 'Gare routière du Nord, Manakara, Madagascar',
              position: new GeoJSONPoint([
                48.01372617246953, -22.130919817993785,
              ]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('gare-routiere-nord-manakara')
                ._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Toliara'),
              address: 'Gare routière, Toliara, Madagascar',
              locationHint: 'En face station shell',
              position: new GeoJSONPoint([43.6809469, -23.3546801]),
              openHours: {
                opensAt: '06:00',
                closesAt: '19:00',
                tzOffset: 3,
              },
              phones: ['0327004079', '0387446891'],
              busStation: busStationSlugMap.get('gare-routiere-toliara')._id,
            },
          ],
        },
        {
          cooperativeId: cooperativeSlugMap.get('kofimanga-plus')._id,
          parkingLots: [
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address: 'Gare routière Maki, Antananarivo, Madagascar',
              locationHint: 'Box 22',
              position: new GeoJSONPoint([
                47.49653637165035, -18.897919744097468,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0346928615', '0346610949'],
              busStation: busStationSlugMap.get('gare-routiere-maki')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address:
                'Rue Dr Raboto Raphael, Manjakaray, Antananarivo, Madagascar',
              locationHint: 'En face du poste de police',
              position: new GeoJSONPoint([
                47.53218410851329, -18.891850160386436,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0341726063'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address: 'Gare routière Ampasampito, Antananarivo, Madagascar',
              position: new GeoJSONPoint([
                47.49653637165035, -18.897919744097468,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0341726063'],
              busStation: busStationSlugMap.get('gare-routiere-ampasampito')
                ._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Moramanga'),
              address: 'Gare routière Moramanga, Moramanga, Madagascar',
              position: new GeoJSONPoint([
                48.23035910436591, -18.947718953637974,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0388727742', '0384449445'],
              busStation: busStationSlugMap.get('gare-routiere-moramanga')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Ambatondrazaka'),
              address: 'Gare routière Ambalabako, Ambatondrazaka, Madagascar',
              position: new GeoJSONPoint([
                48.42283697174949, -17.84474775115543,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0388727742', '0384449445'],
              busStation: busStationSlugMap.get('gare-routiere-ambalabako')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Toamasina'),
              address: 'Gare routière Tanamabo V, Toamasina, Madagascar',
              position: new GeoJSONPoint([
                49.40542918476411, -18.15007613032585,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0340401026', '0349168085'],
              busStation: busStationSlugMap.get('gare-routiere-tanambao-5')._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Fenoarivo Atsinanana'),
              address: 'Gare routière, Fenoarivo Atsinanana, Madagascar',
              position: new GeoJSONPoint([
                49.412006217462476, -17.383070815979043,
              ]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0346610949'],
              busStation: busStationSlugMap.get('gare-routiere-fenerive-est')
                ._id,
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Mahajanga'),
              address: 'Avenue Barday, Mahajanga, Madagascar',
              position: new GeoJSONPoint([46.327103, -17.84474775115543]),
              openHours: {
                opensAt: '06:30',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0324954914', '0332194876'],
              busStation: busStationSlugMap.get('gare-routiere-aranta')._id,
            },
          ],
        },
        {
          cooperativeId: cooperativeSlugMap.get('transam_plus')._id,
          parkingLots: [
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address: 'Ankadindramamy, Antananarivo, Madagascar',
              position: new GeoJSONPoint([
                47.557932513257455, -18.891674483248963,
              ]),
              locationHint: 'En face de Pizzamania',
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0342712227'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Ambatolampy'),
              address: 'Galàna Ambanimaso, Ambatolampy, Madagascar',
              position: new GeoJSONPoint([
                47.440508435955564, -19.3808383577153,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0381166481'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Toamasina'),
              address: 'Gare routière Tanambao V, Toamasina, Madagascar',
              locationHint: 'Derrière station shell',
              position: new GeoJSONPoint([
                49.40649666638811, -18.15013985914179,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0382512227'],
              busStation: busStationSlugMap.get('gare-routiere-tanambao-5')._id,
            },
          ],
        },
        {
          cooperativeId: cooperativeSlugMap.get('soatrans_plus')._id,
          parkingLots: [
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antananarivo'),
              address:
                "Station Galàna Andrefan'Ambohijanahary, Antananarivo, Madagascar",
              position: new GeoJSONPoint([
                47.52104105950984, -18.921057256800477,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0321190500', '0321190507'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Antsirabe'),
              address: 'Avenue Maréchal Foch, Antsirabe, Madagascar',
              position: new GeoJSONPoint([
                47.0343814963102, -19.864435551346194,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0321198481', '0342025119'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Fianarantsoa'),
              address:
                'Enceinte Pietra (Ex Sofia), Ambalakisoa, Fianarantsoa, Madagascar',
              position: new GeoJSONPoint([
                47.09715223035554, -21.44072154588424,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0320377702', '0343477702'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Morondava'),
              address:
                'Enceinte Anjara Hôtel Ambalanomby, Rue de Morondava Centre, Morondava, Madagascar',
              position: new GeoJSONPoint([
                47.0343814963102, -19.864435551346194,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0321192829', '0343433301'],
            },
            {
              _id: new mongo.ObjectId(),
              city: cityNameMap.get('Manakara'),
              address:
                'Annexe Hôtel La Vanille, Ankofafa, Manakara, Madagascar',
              position: new GeoJSONPoint([
                48.012745432273235, -22.147589025695424,
              ]),
              openHours: {
                opensAt: '07:00',
                closesAt: '18:00',
                tzOffset: 3,
              },
              phones: ['0320531777', '0386409611'],
            },
          ],
        },
      ];
      for (const entry of data) {
        for (const parkingLot of entry.parkingLots) {
          parkingLots.push({
            ...parkingLot,
            cooperative: entry.cooperativeId,
          });
        }
      }
      ParkingLotSeeder.parkingLots = parkingLots;
      const parkingLotMainPhotoMap = PhotoSeeder.getParkingLotMainPhotoMap();
      for (const parkingLot of parkingLots) {
        const key = ParkingLotSeeder.generateParkingLotMapKey({
          address: parkingLot.address,
          cooperativeId: parkingLot.cooperative,
        });
        const mainPhotoId = parkingLotMainPhotoMap.get(key);
        if (mainPhotoId) {
          parkingLot.mainPhoto = mainPhotoId;
        }
      }
    }
    return ParkingLotSeeder.parkingLots;
  }

  /**
   * Generates a string key of the parking lot map from a cooperative id and a parking lot address
   */
  static generateParkingLotMapKey(keys: {
    cooperativeId: mongo.BSON.ObjectId;
    address: string;
  }) {
    return `${keys.cooperativeId.toString()}-${keys.address}`;
  }

  /**
   * Getter for the parking lot seed data map singleton
   */
  static getParkingLotMap() {
    if (!ParkingLotSeeder.parkingLotMap) {
      const parkingLotMap = new Map<string, ParkingLotSeederPayload>();
      for (const parkingLot of ParkingLotSeeder.parkingLots) {
        const key = ParkingLotSeeder.generateParkingLotMapKey({
          cooperativeId: parkingLot.cooperative,
          address: parkingLot.address,
        });
        parkingLotMap.set(key, parkingLot);
      }
      ParkingLotSeeder.parkingLotMap = parkingLotMap;
    }
    return ParkingLotSeeder.parkingLotMap;
  }

  /**
   * Gets a parking lot seed data from the parking lot seed data map
   *
   * @param keys The parking lot fields data that are used a key for accessing the map
   */
  static getParkingLotSeedFromMap(keys: {
    cooperativeId: mongo.BSON.ObjectId;
    address: string;
  }) {
    const key = ParkingLotSeeder.generateParkingLotMapKey({
      cooperativeId: keys.cooperativeId,
      address: keys.address,
    });
    return ParkingLotSeeder.getParkingLotMap().get(key);
  }

  /**
   * Parses a parking lot seed into its embedded parking seed version
   */
  static parseEmbeddedParkingLotSeed(
    parkingLotSeed: ParkingLotSeederPayload,
  ): EmbeddedParkingLotSeed {
    const embeddedParkingLotSeed: EmbeddedParkingLotSeed = {
      _id: parkingLotSeed._id,
      address: parkingLotSeed.address,
      city: parkingLotSeed.city,
      openHours: parkingLotSeed.openHours,
      position: parkingLotSeed.position,
      cooperative: parkingLotSeed.cooperative,
    };
    parkingLotSeed.locationHint &&
      (embeddedParkingLotSeed.locationHint = parkingLotSeed.locationHint);
    parkingLotSeed.busStation &&
      (embeddedParkingLotSeed.busStation = parkingLotSeed.busStation);
    return embeddedParkingLotSeed;
  }

  /**
   * Getter for the parking lot seed data map by id singleton
   */
  static getParkingLotMapById() {
    if (!ParkingLotSeeder.parkingLotMapById) {
      const parkingLotsMap = new Map<string, ParkingLotSeederPayload>();
      for (const parkingLot of ParkingLotSeeder.getParkingLots()) {
        parkingLotsMap.set(parkingLot._id.toString(), parkingLot);
      }
      ParkingLotSeeder.parkingLotMapById = parkingLotsMap;
    }
    return ParkingLotSeeder.parkingLotMapById;
  }
}
