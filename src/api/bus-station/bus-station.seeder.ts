import { Connection, mongo } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';

import { BUS_STATION_COLLECTION, BusStation, BusStationModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { CitySeeder } from '../city/city.seeder';
import { ReplaceFields } from 'src/common/types/utils';
import { GeoJSONPoint } from 'src/common/schemas/geojson-point.schema';
import { EmbeddedPhotoSeed } from '../photo/photo';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as busStationSeedOptions from '../../../seed/bus-station.seed.json';
import { EmbeddedCitySeed } from '../city/city';
import { WithoutTimestamps } from 'src/common/types/timestamps';

export type BusStationSeederPayload = WithoutTimestamps<
  WithMongoId<
    ReplaceFields<
      BusStation,
      {
        city: EmbeddedCitySeed;
        mainPhotoId?: mongo.BSON.ObjectId;
        photos?: EmbeddedPhotoSeed[];
      }
    >
  >
>;

type BusStationSeedOptions = ReplaceFields<
  Omit<BusStation, 'city' | 'mainPhotoId' | 'createdAt' | 'updatedAt'>,
  {
    cityName: string;
    position: [number, number];
    mainPhoto?: string;
    photos?: string[];
  }
>;

type GeneratedEmbeddedPhotosSeed = {
  mainPhotoId: mongo.BSON.ObjectId;
  photos: EmbeddedPhotoSeed[];
};

export class BusStationSeeder implements Seeder {
  // Bus stations seed data singleton
  private static busStations: BusStationSeederPayload[] | null = null;

  // Singleton of a map of the bus stations seed data with the slug as the key
  private static busStationSlugMap: Map<
    string,
    BusStationSeederPayload
  > | null = null;

  constructor(
    @InjectModel(BusStation.name) private busStationModel: BusStationModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.busStationModel.insertMany(BusStationSeeder.getBusStations());
    await session.commitTransaction();
    console.log(`Seeded the \`${BUS_STATION_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.busStationModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection(BUS_STATION_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${BUS_STATION_COLLECTION}\` collection ...`);
  }

  // Getter for the bus stations seed data singleton
  static getBusStations() {
    if (!BusStationSeeder.busStations) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const busStationsSeedOptions =
        busStationSeedOptions as BusStationSeedOptions[];
      const busStations = busStationsSeedOptions.map<BusStationSeederPayload>(
        (options) => {
          const busStation: BusStationSeederPayload = {
            _id: new mongo.ObjectId(),
            city: CitySeeder.parseEmbeddedCity(
              cityNameMap.get(options.cityName),
              { withWeight: true },
            ),
            position: new GeoJSONPoint(options.position),
            stationName: options.stationName,
            slug: options.slug,
            highways: options.highways,
            street: options.street,
          };
          if (options.mainPhoto) {
            const { mainPhotoId, photos } =
              BusStationSeeder.generateEmbeddedPhotosSeed(
                options.photos as string[],
                options.mainPhoto,
              );
            busStation.mainPhotoId = mainPhotoId;
            busStation.photos = photos;
          }
          return busStation;
        },
      );
      BusStationSeeder.busStations = busStations;
    }
    return BusStationSeeder.busStations;
  }

  /**
   * Getter for the bus stations slug map singleton
   */
  static getBusStationSlugMap() {
    if (!BusStationSeeder.busStationSlugMap) {
      const busStationSlugMap = new Map<string, BusStationSeederPayload>();
      for (const busStation of BusStationSeeder.getBusStations()) {
        busStationSlugMap.set(busStation.slug, busStation);
      }
      BusStationSeeder.busStationSlugMap = busStationSlugMap;
    }
    return BusStationSeeder.busStationSlugMap;
  }

  /**
   * Generates an array of embedded photos seed data and their main photo id
   * from an array of photos filenames and the main photo filename
   *
   * @param photos The array of photos filenames
   * @param mainPhoto The filename of the photos
   */
  static generateEmbeddedPhotosSeed(
    photos: string[],
    mainPhoto: string,
  ): GeneratedEmbeddedPhotosSeed {
    let mainPhotoId: mongo.BSON.ObjectId;
    const embeddedPhotos = photos.map<EmbeddedPhotoSeed>((photo) => {
      const id = new mongo.ObjectId();
      if (mainPhoto === photo) {
        mainPhotoId = id;
      }
      return {
        _id: id,
        filename: photo,
      };
    });
    return {
      mainPhotoId,
      photos: embeddedPhotos,
    };
  }
}
