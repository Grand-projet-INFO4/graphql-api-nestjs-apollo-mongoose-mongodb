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
import * as parkingLotsByCooperativeSeedOptions from '../../../seed/parking-lot.seed.json';

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

type ParkingLotsByCooperativeSeedOptions = {
  cooperativeSlug: string;
  parkingLots: ReplaceFields<
    Omit<
      ParkingLotSeederPayload,
      '_id' | 'cooperative' | 'city' | 'busStation' | 'mainPhoto'
    >,
    {
      cityName: string;
      position: [number, number];
      busStationSlug?: string;
    }
  >[];
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
      const parkingLotsByCooperativeSeedsOptions =
        parkingLotsByCooperativeSeedOptions as ParkingLotsByCooperativeSeedOptions[];
      for (const options of parkingLotsByCooperativeSeedsOptions) {
        for (const parkingLotSeed of options.parkingLots) {
          const parkingLot: ParkingLotSeederPayload = {
            _id: new mongo.ObjectId(),
            address: parkingLotSeed.address,
            openHours: parkingLotSeed.openHours,
            phones: parkingLotSeed.phones,
            position: new GeoJSONPoint(parkingLotSeed.position),
            city: cityNameMap.get(parkingLotSeed.cityName),
            cooperative: cooperativeSlugMap.get(options.cooperativeSlug)._id,
          };
          parkingLotSeed.locationHint &&
            (parkingLot.locationHint = parkingLotSeed.locationHint);
          if (parkingLotSeed.busStationSlug) {
            parkingLot.busStation = busStationSlugMap.get(
              parkingLotSeed.busStationSlug,
            )._id;
          }
          parkingLots.push(parkingLot);
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
