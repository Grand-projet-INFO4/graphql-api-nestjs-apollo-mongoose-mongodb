import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';

import {
  CooperativePhoto,
  CooperativePhotoModel,
  PHOTO_COLLECTION,
  Photo,
  PhotoModel,
} from './schema';
import { ReplaceFields } from 'src/common/types/utils';
import { WithMongoId } from 'src/common/types/mongo-id';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { ParkingLotSeeder } from '../parking-lot/parking-lot.seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as photosByCooperativeSeedOptions from '../../../seed/photo.seed.json';

type CooperativePhotosSeedOptions = {
  photos: string[];
  cooperativeId: mongo.BSON.ObjectId;
  parkingLots: ParkingLotPhotosSeedOptions[];
};

type ParkingLotPhotosSeedOptions = {
  address: string;
  mainPhoto: string;
  photos: WithMongoId<{ filename: string }>[];
};

export type CooperativePhotoSeederPayload = WithMongoId<
  ReplaceFields<
    CooperativePhoto,
    {
      filename: string;
      parkingLotId?: mongo.BSON.ObjectId;
      cooperativeId: mongo.BSON.ObjectId;
    }
  >
>;

export class PhotoSeeder implements Seeder {
  // Photos seed data singleton
  private static photos: CooperativePhotoSeederPayload[] | null = null;

  // The photos seed data options singleton
  private static photosOptions: CooperativePhotosSeedOptions[] | null = null;

  // Map of cooperative id - parking lot address combination key and parking lot's main photo id value singleton
  private static parkingLotMainPhotoMap: Map<
    string,
    mongo.BSON.ObjectId
  > | null = null;

  constructor(
    @InjectModel(Photo.name) private photoModel: PhotoModel,
    @InjectModel(CooperativePhoto.name)
    private cooperativephotoModel: CooperativePhotoModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.cooperativephotoModel.insertMany(PhotoSeeder.getPhotos());
    await session.commitTransaction();
    console.log(`Seeded the \`${PHOTO_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.photoModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(PHOTO_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${PHOTO_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the photos seed data options singleton
   */
  static getPhotosOptions() {
    if (!PhotoSeeder.photosOptions) {
      const cooperativeSlugMap = CooperativeSeeder.getCooperativesSlugMap();
      const photosOptions =
        photosByCooperativeSeedOptions.map<CooperativePhotosSeedOptions>(
          (options) => ({
            cooperativeId: cooperativeSlugMap.get(options.cooperativeSlug)._id,
            photos: options.photos,
            parkingLots: options.parkingLots.map<ParkingLotPhotosSeedOptions>(
              (parkingLot) => ({
                address: parkingLot.address,
                mainPhoto: parkingLot.mainPhoto,
                photos: parkingLot.photos.map((filename) => ({
                  _id: new mongo.ObjectId(),
                  filename,
                })),
              }),
            ),
          }),
        );
      PhotoSeeder.photosOptions = photosOptions;
    }
    return PhotoSeeder.photosOptions;
  }

  /**
   * Getter for the photos seed data singleton
   */
  static getPhotos() {
    if (!PhotoSeeder.photos) {
      const coopParkingLotPhotoAddressMapMap = new Map<
        string,
        Map<string, string>
      >();
      const photos: CooperativePhotoSeederPayload[] = [];
      const photosOptions = PhotoSeeder.getPhotosOptions();
      for (const coopPhotosOptions of photosOptions) {
        for (const photo of coopPhotosOptions.photos) {
          photos.push({
            _id: new mongo.ObjectId(),
            filename: photo,
            cooperativeId: coopPhotosOptions.cooperativeId,
          });
        }
        const coopParkingLotPhotoAddressMapMapKey =
          coopPhotosOptions.cooperativeId.toString();
        const parkingLotPhotoAddressMap =
          coopParkingLotPhotoAddressMapMap.get(
            coopParkingLotPhotoAddressMapMapKey,
          ) ?? new Map<string, string>();
        if (
          !coopParkingLotPhotoAddressMapMap.has(
            coopParkingLotPhotoAddressMapMapKey,
          )
        ) {
          coopParkingLotPhotoAddressMapMap.set(
            coopParkingLotPhotoAddressMapMapKey,
            parkingLotPhotoAddressMap,
          );
        }
        for (const parkingLotPhotosOptions of coopPhotosOptions.parkingLots) {
          for (const photo of parkingLotPhotosOptions.photos) {
            const plPhoto: CooperativePhotoSeederPayload = {
              _id: photo._id,
              filename: photo.filename,
              cooperativeId: coopPhotosOptions.cooperativeId,
            };
            photos.push(plPhoto);
            const parkingLotPhotoAddressMapKey = plPhoto._id.toString();
            parkingLotPhotoAddressMap.set(
              parkingLotPhotoAddressMapKey,
              parkingLotPhotosOptions.address,
            );
          }
        }
      }
      PhotoSeeder.photos = photos;
      let prevCooperativeId: string,
        prevParkingLotPhotoAddressMap: Map<string, string>;
      for (const photo of photos) {
        const cooperativeId = photo.cooperativeId.toString();
        const parkingLotPhotoAddressMap =
          !prevCooperativeId || cooperativeId !== prevCooperativeId
            ? coopParkingLotPhotoAddressMapMap.get(cooperativeId)
            : prevParkingLotPhotoAddressMap;
        const address = parkingLotPhotoAddressMap.get(photo._id.toString());
        if (address) {
          const parkingLotId = ParkingLotSeeder.getParkingLotSeedFromMap({
            address,
            cooperativeId: photo.cooperativeId,
          })._id;
          photo.parkingLotId = parkingLotId;
        }
        prevCooperativeId = cooperativeId;
        prevParkingLotPhotoAddressMap = parkingLotPhotoAddressMap;
      }
    }
    return PhotoSeeder.photos;
  }

  /**
   * Getter for the parking lot main photo map singleton
   */
  static getParkingLotMainPhotoMap() {
    if (!PhotoSeeder.parkingLotMainPhotoMap) {
      const parkingLotMainPhotoMap = new Map<string, mongo.BSON.ObjectId>();
      const photosOptions = PhotoSeeder.getPhotosOptions();
      for (const cooperativePhotosOptions of photosOptions) {
        for (const parkingLotPhotosOptions of cooperativePhotosOptions.parkingLots) {
          const key = ParkingLotSeeder.generateParkingLotMapKey({
            address: parkingLotPhotosOptions.address,
            cooperativeId: cooperativePhotosOptions.cooperativeId,
          });
          const mainPhoto = parkingLotPhotosOptions.photos.find(
            (photo) => photo.filename === parkingLotPhotosOptions.mainPhoto,
          ) as WithMongoId<{ filename: string }>;
          parkingLotMainPhotoMap.set(key, mainPhoto._id);
        }
      }
      PhotoSeeder.parkingLotMainPhotoMap = parkingLotMainPhotoMap;
    }
    return PhotoSeeder.parkingLotMainPhotoMap;
  }
}
