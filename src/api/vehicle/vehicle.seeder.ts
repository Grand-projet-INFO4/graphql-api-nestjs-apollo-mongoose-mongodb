import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { VEHICLE_COLLECTION, Vehicle, VehicleModel } from './schema';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedPhotoSeed } from '../photo/photo';
import { EmbeddedTrackingDeviceSeed } from '../tracking-device/tracking-device';
import { CarModelSeeder } from '../car-model/car-model.seeder';
import { EmbeddedCarModelSeed } from '../car-model/car-model';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { DriverSeeder } from '../driver/driver.seeder';
import { EmbeddedVehicleSeed } from './vehicle';
import { TripSeeder } from '../trip/trip.seeder';
import { TripStatus } from '../trip/trip.constants';
import * as vehiclesByCooperativeSeedOptions from '../../../seed/vehicle.seed.json';
import { TrackingDeviceSeeder } from '../tracking-device/tracking-device.seeder';

export type VehicleSeederPayload = WithMongoId<
  ReplaceFields<
    Vehicle,
    {
      mainPhotoId?: mongo.BSON.ObjectId;
      photos?: EmbeddedPhotoSeed[];
      tracker?: EmbeddedTrackingDeviceSeed;
      model: EmbeddedCarModelSeed;
      cooperative: mongo.BSON.ObjectId;
      ongoingTrip?: mongo.BSON.ObjectId;
      drivers?: mongo.BSON.ObjectId[];
    }
  >
>;

type CooperativeVehiclesSeedOptions = {
  cooperativeSlug: string;
  vehicles: ReplaceFields<
    Omit<
      VehicleSeederPayload,
      '_id' | 'cooperative' | 'mainPhotoId' | 'drivers'
    >,
    {
      mainPhoto?: string;
      photos?: string[];
      model: {
        modelName: string;
        brand: string;
      };
      driversKeys?: { firstName: string; lastName: string }[];
    }
  >[];
};

/**
 * Generates the main photo id and the photos of a vehicle seed data from a main photo and photos filenames
 */
function generateVehiclePhotosSeed(mainPhoto: string, photos: string[]) {
  let mainPhotoId: mongo.BSON.ObjectId;
  const _photos: EmbeddedPhotoSeed[] = [];
  for (const photo of photos) {
    const _photo: EmbeddedPhotoSeed = {
      _id: new mongo.ObjectId(),
      filename: photo,
    };
    if (photo === mainPhoto) {
      mainPhotoId = _photo._id;
    }
  }
  return {
    mainPhotoId,
    photos: _photos,
  };
}

export class VehicleSeeder implements Seeder {
  // Vehicles seed data singleton
  private static vehicles: VehicleSeederPayload[] | null = null;

  // Map of vehicle plate id key and vehicle seed data value singleton
  private static vehicleMap: Map<string, VehicleSeederPayload> | null = null;

  // Map of vehicle id key and vehicles value singleton
  private static vehicleMapById: Map<string, VehicleSeederPayload> | null =
    null;

  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: VehicleModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.vehicleModel.insertMany(VehicleSeeder.getVehicles());
    await session.commitTransaction();
    console.log(`Seeded the \`${VEHICLE_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.vehicleModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(VEHICLE_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${VEHICLE_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the vehicles seed data singleton
   */
  static getVehicles() {
    if (!VehicleSeeder.vehicles) {
      const cooperativeMap = CooperativeSeeder.getCooperativesSlugMap();
      const vehiclesByCooperativeOptions =
        vehiclesByCooperativeSeedOptions as CooperativeVehiclesSeedOptions[];
      const driversKeysMap = new Map<
        string,
        { firstName: string; lastName: string }[]
      >();
      const vehicles: VehicleSeederPayload[] = [];
      for (const option of vehiclesByCooperativeOptions) {
        for (const vehicle of option.vehicles) {
          const _vehicle: VehicleSeederPayload = {
            _id: new mongo.ObjectId(),
            plateId: vehicle.plateId,
            model: CarModelSeeder.getCarModelSeedDataFromMap(vehicle.model),
            seatsCount: vehicle.seatsCount,
            state: vehicle.state,
            status: vehicle.status,
            cooperative: cooperativeMap.get(option.cooperativeSlug)._id,
          };
          if (vehicle.mainPhoto) {
            const photosSeed = generateVehiclePhotosSeed(
              vehicle.mainPhoto,
              vehicle.photos as string[],
            );
            _vehicle.mainPhotoId = photosSeed.mainPhotoId;
            _vehicle.photos = photosSeed.photos;
          }
          vehicle.removedSeats &&
            (_vehicle.removedSeats = vehicle.removedSeats);
          vehicle.tracker && (_vehicle.tracker = vehicle.tracker);
          vehicle.ongoingTrip && (_vehicle.ongoingTrip = vehicle.ongoingTrip);
          if (vehicle.driversKeys) {
            driversKeysMap.set(_vehicle._id.toString(), vehicle.driversKeys);
          }
          vehicles.push(_vehicle);
        }
      }
      VehicleSeeder.vehicles = vehicles;
      const ongoingTripsIdsIterator = TripSeeder.createTripsIdsGenerator(
        TripStatus.Ongoing,
      )();
      const trackingDeviceIdMap = TrackingDeviceSeeder.getTrackingDeviceIdMap();
      const trackingDeviceMap = TrackingDeviceSeeder.getTrackingDeviceMap();
      for (const vehicle of vehicles) {
        const driversKeysItems = driversKeysMap.get(vehicle._id.toString());
        vehicle.drivers = driversKeysItems.map<mongo.BSON.ObjectId>(
          (keys) => DriverSeeder.getDriverSeedFromMap(keys)._id,
        );
        vehicle.ongoingTrip = ongoingTripsIdsIterator.next()
          .value as mongo.BSON.ObjectId;
        const trackerId = trackingDeviceIdMap.get(vehicle.plateId);
        if (trackerId) {
          vehicle.tracker = TrackingDeviceSeeder.parseEmbeddedTrackingDevice(
            trackingDeviceMap.get(trackerId.toString()),
          );
        }
      }
    }
    return VehicleSeeder.vehicles;
  }

  /**
   * Getter for the vehicle map singleton
   */
  static getVehicleMap() {
    if (!VehicleSeeder.vehicleMap) {
      const vehicleMap = new Map<string, VehicleSeederPayload>();
      for (const vehicle of VehicleSeeder.getVehicles()) {
        vehicleMap.set(vehicle.plateId, vehicle);
      }
      VehicleSeeder.vehicleMap = vehicleMap;
    }
    return VehicleSeeder.vehicleMap;
  }

  /**
   * Getter for the vehicle map by id singleton
   */
  static getVehicleMapById() {
    if (!VehicleSeeder.vehicleMapById) {
      const vehicleMapById = new Map<string, VehicleSeederPayload>();
      for (const vehicle of VehicleSeeder.getVehicles()) {
        vehicleMapById.set(vehicle._id.toString(), vehicle);
      }
      VehicleSeeder.vehicleMapById = vehicleMapById;
    }
    return VehicleSeeder.vehicleMapById;
  }

  /**
   * Parses a vehicle seed into its embedded vehicle seed version
   */
  static parseEmbeddedVehicleSeed(
    vehicle: VehicleSeederPayload,
  ): EmbeddedVehicleSeed {
    const embeddedVehicle: EmbeddedVehicleSeed = {
      _id: vehicle._id,
      model: vehicle.model,
      plateId: vehicle.plateId,
      seatsCount: vehicle.seatsCount,
      state: vehicle.state,
      cooperative: vehicle.cooperative,
    };
    vehicle.removedSeats &&
      (embeddedVehicle.removedSeats = vehicle.removedSeats);
    return embeddedVehicle;
  }
}
