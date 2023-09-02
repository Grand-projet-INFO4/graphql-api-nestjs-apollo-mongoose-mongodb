import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { mongo } from 'mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';

import { WithMongoId } from 'src/common/types/mongo-id';
import {
  TRACKING_DEVICE_COLLECTION,
  TrackingDevice,
  TrackingDeviceModel,
} from './schema';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as trackingDeviceSeed from '../../../seed/tracking-device.seed.json';
import { WithoutTimestamps } from 'src/common/types/timestamps';
import { VehicleSeeder } from '../vehicle/vehicle.seeder';
import { GeoJSONPoint } from 'src/common/schemas/geojson-point.schema';
import { EmbeddedTrackingDeviceSeed } from './tracking-device';

export type TrackingDeviceSeederPayload = WithMongoId<TrackingDevice>;

type TrackingDeviceSeedptions = Omit<
  WithoutTimestamps<TrackingDevice>,
  'vehicle' | 'cooperative' | 'disconnectedAt' | 'position'
> & {
  vehiclePlate: string;
  position: [number, number];
};

export class TrackingDeviceSeeder implements Seeder {
  // Tracking devices seed data singleton
  private static trackingDevices: TrackingDeviceSeederPayload[] | null = null;

  // Ids of the tracking devices seed data singleton
  private static trackingDevicesIds: mongo.BSON.ObjectId[] | null = null;

  // Map of vehicle plate key and tracking device id value singleton
  private static trackingDeviceIdMap: Map<string, mongo.BSON.ObjectId> | null =
    null;

  // Map of tracking device id key and tracking device value singleton
  private static trackingDeviceMap: Map<
    string,
    TrackingDeviceSeederPayload
  > | null = null;

  constructor(
    @InjectModel(TrackingDevice.name)
    private trackingDeviceModel: TrackingDeviceModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.trackingDeviceModel.insertMany(
      TrackingDeviceSeeder.getTrackingDevices(),
    );
    await session.commitTransaction();
    console.log(`Cleared the \`${TRACKING_DEVICE_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.trackingDeviceModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(TRACKING_DEVICE_COLLECTION);
    await session.commitTransaction();
    console.log(`Seeded the \`${TRACKING_DEVICE_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the tracking devices seed data singleton
   */
  static getTrackingDevices(): TrackingDeviceSeederPayload[] {
    if (!TrackingDeviceSeeder.trackingDevices) {
      const trackingDevicesSeeds =
        trackingDeviceSeed as TrackingDeviceSeedptions[];
      const tempId = new mongo.ObjectId();
      const trackingDeviceIdMap = TrackingDeviceSeeder.getTrackingDeviceIdMap();
      const trackingDevices =
        trackingDevicesSeeds.map<TrackingDeviceSeederPayload>((options) => {
          const now = new Date();
          return {
            _id: trackingDeviceIdMap.get(options.vehiclePlate),
            serialId: options.serialId,
            position: new GeoJSONPoint(options.position),
            speed: options.speed,
            connected: options.connected,
            disconnectedAt: faker.date.recent({
              refDate: now,
            }),
            vehicle: tempId,
            cooperative: tempId,
            createdAt: now,
            updatedAt: now,
          };
        });
      TrackingDeviceSeeder.trackingDevices = trackingDevices;
      const vehicleMap = VehicleSeeder.getVehicleMap();
      trackingDevices.forEach((device, i) => {
        const vehicle = vehicleMap.get(trackingDevicesSeeds[i].vehiclePlate);
        device.vehicle = vehicle._id;
        device.cooperative = vehicle.cooperative;
      });
    }
    return TrackingDeviceSeeder.trackingDevices;
  }

  /**
   * Gets a the singleton of tracking devices ids
   */
  private static getTrackingDevicesIds() {
    if (!TrackingDeviceSeeder.trackingDevicesIds) {
      TrackingDeviceSeeder.trackingDevicesIds =
        trackingDeviceSeed.map<mongo.BSON.ObjectId>(() => new mongo.ObjectId());
    }
    return TrackingDeviceSeeder.trackingDevicesIds;
  }

  /**
   * Getter for the tracking device id map by vehicle id
   */
  static getTrackingDeviceIdMap() {
    if (!TrackingDeviceSeeder.trackingDeviceIdMap) {
      const trackingDeviceIdMap = new Map<string, mongo.BSON.ObjectId>();
      const count = trackingDeviceSeed.length;
      const ids = TrackingDeviceSeeder.getTrackingDevicesIds();
      for (let i = 0; i < count; i++) {
        const { vehiclePlate } = trackingDeviceSeed[i];
        trackingDeviceIdMap.set(vehiclePlate, ids[i]);
      }
      TrackingDeviceSeeder.trackingDeviceIdMap = trackingDeviceIdMap;
    }
    return TrackingDeviceSeeder.trackingDeviceIdMap;
  }

  /**
   * Getter for the tracking devices map singleton
   */
  static getTrackingDeviceMap() {
    if (!TrackingDeviceSeeder.trackingDeviceMap) {
      const trackingDeviceMap = new Map<string, TrackingDeviceSeederPayload>();
      for (const device of TrackingDeviceSeeder.getTrackingDevices()) {
        trackingDeviceMap.set(device._id.toString(), device);
      }
      TrackingDeviceSeeder.trackingDeviceMap = trackingDeviceMap;
    }
    return TrackingDeviceSeeder.trackingDeviceMap;
  }

  /**
   * Parses a tracking device seed to an embedded tracking device seed
   */
  static parseEmbeddedTrackingDevice(
    trackingDevice: TrackingDeviceSeederPayload,
  ): EmbeddedTrackingDeviceSeed {
    return {
      _id: trackingDevice._id,
      serialId: trackingDevice.serialId,
      position: trackingDevice.position,
      speed: trackingDevice.speed,
      connected: trackingDevice.connected,
      disconnectedAt: trackingDevice.disconnectedAt,
      updatedAt: trackingDevice.updatedAt,
    };
  }
}
