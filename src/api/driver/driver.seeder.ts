import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';

import { DRIVER_COLLECTION, Driver, DriverModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { UserSeeder } from '../user/user.seeder';
import { VehicleSeeder } from '../vehicle/vehicle.seeder';
import { substractNowDate } from 'src/common/utils/date-time.utils';
import * as driverSeeds from '../../../seed/driver.seed.json';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

export type DriverSeederPayload = WithMongoId<
  ReplaceFields<
    Driver,
    {
      user?: mongo.BSON.ObjectId;
      cooperative: mongo.BSON.ObjectId;
      ongoingTrip?: mongo.BSON.ObjectId;
      vehicle?: mongo.BSON.ObjectId;
    }
  >
>;

type CooperativeDriversSeed = {
  cooperativeSlug: string;
  drivers: (Omit<
    Driver,
    | 'cooperative'
    | 'user'
    | 'ongoingTrip'
    | 'vehicle'
    | 'hiredAt'
    | 'latestTripAt'
  > & {
    hiredMonthsAgo: number;
    latestTripHoursAgo: number;
    username?: string;
    ongoingTripId?: string;
    vehiclePlateId?: string;
  })[];
};

export class DriverSeeder implements Seeder {
  // Drivers seed data singleton
  private static drivers: DriverSeederPayload[] | null = null;

  // Map of driver first name and last name combination key and driver seed data value singleton
  private static driverMap: Map<string, DriverSeederPayload> | null = null;

  constructor(
    @InjectModel(Driver.name) private driverModel: DriverModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.driverModel.insertMany(DriverSeeder.getDrivers());
    } catch (e) {
      console.log({ error: e.message });
      throw new Error();
    }
    await session.commitTransaction();
    console.log('Seeded the `' + DRIVER_COLLECTION + '` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.driverModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(DRIVER_COLLECTION);
    await session.commitTransaction();
    console.log('Cleared the `' + DRIVER_COLLECTION + '` collection ...');
  }

  /**
   * Getter for the drivers seed data singleton
   */
  static getDrivers() {
    if (!DriverSeeder.drivers) {
      const userMap = UserSeeder.getUsernameMap();
      const cooperativeMap = CooperativeSeeder.getCooperativesSlugMap();
      const seeds = driverSeeds as CooperativeDriversSeed[];
      const vehiclePlateIdMap = new Map<string, string>();
      const drivers: DriverSeederPayload[] = [];
      for (const seed of seeds) {
        for (const coopDriver of seed.drivers) {
          const driver: DriverSeederPayload = {
            _id: new mongo.ObjectId(),
            firstName: coopDriver.firstName,
            lastName: coopDriver.lastName,
            email: coopDriver.email,
            phones: coopDriver.phones,
            license: coopDriver.license,
            cooperative: cooperativeMap.get(seed.cooperativeSlug)._id,
          };
          coopDriver.hiredMonthsAgo &&
            (driver.hiredAt = substractNowDate(
              coopDriver.hiredMonthsAgo,
              'month',
            ));
          coopDriver.latestTripHoursAgo &&
            (driver.latestTripAt = substractNowDate(
              coopDriver.latestTripHoursAgo,
              'hour',
            ));
          coopDriver.username &&
            (driver.user = userMap.get(coopDriver.username)._id);
          coopDriver.ongoingTripId &&
            (driver.ongoingTrip = new mongo.ObjectId(coopDriver.ongoingTripId));
          drivers.push(driver);
          coopDriver.vehiclePlateId &&
            vehiclePlateIdMap.set(
              driver._id.toString(),
              coopDriver.vehiclePlateId,
            );
        }
      }
      DriverSeeder.drivers = drivers;
      const vehicleMap = VehicleSeeder.getVehicleMap();
      for (const driver of drivers) {
        const vehiclePlateId = vehiclePlateIdMap.get(driver._id.toString());
        if (vehiclePlateId) {
          driver.vehicle = vehicleMap.get(vehiclePlateId)._id;
        }
      }
    }
    return DriverSeeder.drivers;
  }

  /**
   * Generates a key for the driver map from a combo of first name and last name
   */
  static generateDriverMapKey(keys: {
    firstName: string;
    lastName: string;
  }): string {
    return `${keys.firstName}-${keys.lastName}`;
  }

  /**
   * Getter for the driver map singleton
   */
  static getDriverMap() {
    if (!DriverSeeder.driverMap) {
      const driverMap = new Map<string, DriverSeederPayload>();
      for (const driver of DriverSeeder.getDrivers()) {
        const key = DriverSeeder.generateDriverMapKey({
          firstName: driver.firstName,
          lastName: driver.lastName,
        });
        driverMap.set(key, driver);
      }
      DriverSeeder.driverMap = driverMap;
    }
    return DriverSeeder.driverMap;
  }

  /**
   * Gets a driver seed data from the driver map
   */
  static getDriverSeedFromMap(keys: { firstName: string; lastName: string }) {
    const key = DriverSeeder.generateDriverMapKey({
      firstName: keys.firstName,
      lastName: keys.lastName,
    });
    return DriverSeeder.getDriverMap().get(key);
  }
}
