import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { TRIP_COLLECTION, Trip, TripModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedVehicleSeed } from '../vehicle/vehicle';
import { TripDriverSeed } from '../driver/driver';
import { EmbeddedBookingSeed } from '../booking/booking';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { DriverSeeder } from '../driver/driver.seeder';
import { RouteSeeder } from '../route/route.seeder';
import { EmbeddedRouteSeed } from '../route/route';
import {
  getRandomBoolean,
  getRandomInteger,
} from 'src/common/utils/number.utils';
import { TripPathSeed } from './trip';
import { VehicleSeeder } from '../vehicle/vehicle.seeder';
import { TripStatus } from './trip.constants';
import { BookingSeeder } from '../booking/booking.seeder';
import { haveSameDate } from 'src/common/utils/date-time.utils';

export type TripSeederPayload = WithMongoId<
  ReplaceFields<
    Trip,
    {
      route: EmbeddedRouteSeed;
      path: TripPathSeed;
      bookings: EmbeddedBookingSeed[];
      currentVehicle: EmbeddedVehicleSeed;
      currentDrivers: TripDriverSeed[];
      vehicle: mongo.BSON.ObjectId;
      drivers: mongo.BSON.ObjectId[];
      cooperative: mongo.BSON.ObjectId;
    }
  >
>;

export class TripSeeder implements Seeder {
  // Trips seed data singleton
  private static trips: TripSeederPayload[] | null = null;

  // Completed trips seed data singleton
  private static completedTrips: TripSeederPayload[] | null = null;

  // Completed trips seed data' ids singleton
  private static completedTripsIds: mongo.BSON.ObjectId[] | null = null;

  // Ongoing trips seed data singleton
  private static ongoingTrips: TripSeederPayload[] | null = null;

  // Ongoing trips seed data' ids singleton
  private static ongoingTripsIds: mongo.BSON.ObjectId[] | null = null;

  constructor(
    @InjectModel(Trip.name) private tripModel: TripModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.tripModel.insertMany(TripSeeder.getTrips());
    await session.commitTransaction();
    console.log(`Seeded the \`${TRIP_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.tripModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection(TRIP_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${TRIP_COLLECTION}\` collection ...`);
  }

  /**
   * Generates a random path seed from a given embedded route seed
   */
  static getRandomRoutePath(route: EmbeddedRouteSeed): TripPathSeed {
    const departIndex = getRandomBoolean();
    const from = route.parkingLots[departIndex].city;
    const to = route.parkingLots[Number(!departIndex)].city;
    return { from, to };
  }

  /**
   * Getter for the trips' ids singleton depending on the status
   */
  static getTripsIdsByStatus(status: TripStatus): mongo.BSON.ObjectId[] {
    const actualIds =
      status === TripStatus.Ongoing
        ? TripSeeder.ongoingTripsIds
        : TripSeeder.completedTripsIds;
    if (!actualIds) {
      const ids: mongo.BSON.ObjectId[] = [];
      for (let i = 0; i < DriverSeeder.getDriverSeedsCount(); i++) {
        ids.push(new mongo.ObjectId());
      }
      if (status === TripStatus.Ongoing) {
        TripSeeder.ongoingTripsIds = ids;
      } else {
        TripSeeder.completedTripsIds = ids;
      }
      return ids;
    }
    return actualIds;
  }

  /**
   * Creates a generator function that iterates through the trips ids depending on the status
   */
  static createTripsIdsGenerator(status: TripStatus) {
    return function* () {
      const ids = TripSeeder.getTripsIdsByStatus(status);
      for (const id of ids) {
        yield id;
      }
    };
  }

  /**
   * Generates trips seed data for a given status that are mapped to the existing drivers
   */
  private static generateTrips(status: TripStatus): TripSeederPayload[] {
    const trips: TripSeederPayload[] = [];
    const coopDriversMap = DriverSeeder.getCoopDriversMap();
    const coopRoutesMap = RouteSeeder.getCooperativeRoutesMap();
    const vehicleMap = VehicleSeeder.getVehicleMapById();
    const tripsIdsIterator = TripSeeder.createTripsIdsGenerator(status)();
    coopDriversMap.forEach((coopDrivers, cooperativeId) => {
      const coopRoutes = coopRoutesMap.get(cooperativeId),
        coopRoutesCount = coopRoutes.length,
        coopDriversCount = coopDrivers.length;
      for (let i = 0; i < coopDriversCount; i++) {
        const driver = coopDrivers[i],
          vehicle = vehicleMap.get(
            (driver.vehicle as mongo.BSON.ObjectId).toString(),
          );
        const route = RouteSeeder.parseEmbeddedRouteSeed(
          coopRoutes[i % coopRoutesCount],
        );
        let startedAt: Date;
        switch (status) {
          case TripStatus.Ongoing: {
            const now = new Date(),
              nowHours = now.getHours(),
              latestTripAt = driver.latestTripAt as Date,
              latestTripAtHours = latestTripAt.getHours();
            if (haveSameDate(now, latestTripAt)) {
              const limitHours = Math.min(nowHours, 20);
              const hours = getRandomInteger(
                limitHours,
                Math.max(latestTripAtHours, 7),
              );
              now.setHours(hours);
              now.setMinutes(0);
              startedAt = now;
            } else if (nowHours <= 6) {
              startedAt = new Date(latestTripAt);
              const hours = getRandomInteger(20, latestTripAtHours);
              startedAt.setHours(hours);
              startedAt.setMinutes(0);
            } else {
              const hours = nowHours > 7 ? getRandomInteger(nowHours, 7) : 7;
              now.setHours(hours);
              now.setMinutes(0);
              startedAt = now;
            }
            break;
          }
          case TripStatus.Completed: {
            startedAt = new Date(
              (driver.latestTripAt as Date).getTime() -
                route.approxDuration * 60 * 1000,
            );
            const startedAtHours = startedAt.getHours(),
              startedAtMinutes = startedAt.getMinutes();
            if (
              (startedAtHours >= 20 && startedAtMinutes > 0) ||
              startedAtHours <= 6
            ) {
              if (
                startedAtHours >= 1 &&
                startedAtMinutes >= 30 &&
                startedAtHours <= 6
              ) {
                startedAt.setHours(7);
                startedAt.setMinutes(0);
              } else {
                startedAt.setHours(20);
                startedAt.setMinutes(0);
              }
            }
            break;
          }
          default:
            break;
        }
        const completedTrip: TripSeederPayload = {
          _id: tripsIdsIterator.next().value as mongo.BSON.ObjectId,
          route,
          path: TripSeeder.getRandomRoutePath(route),
          bookings: [],
          currentVehicle: VehicleSeeder.parseEmbeddedVehicleSeed(vehicle),
          currentDrivers: [DriverSeeder.parseTripDriverSeed(driver)],
          startsAt: startedAt,
          startedAt,
          completedAt:
            status === TripStatus.Completed
              ? (driver.latestTripAt as Date)
              : null,
          status,
          checkoutDelay: 30,
          vehicle: vehicle._id,
          drivers: [driver._id],
          cooperative: driver.cooperative,
        };
        trips.push(completedTrip);
      }
    });
    return trips;
  }

  /**
   * Getter for the completed trips seed data singleton
   */
  private static getCompletedTrips() {
    if (!TripSeeder.completedTrips) {
      TripSeeder.completedTrips = TripSeeder.generateTrips(
        TripStatus.Completed,
      );
    }
    return TripSeeder.completedTrips;
  }

  /**
   * Getter for the ongoing trips seed data singleton
   */
  static getOngoingTrips() {
    if (!TripSeeder.ongoingTrips) {
      TripSeeder.ongoingTrips = TripSeeder.generateTrips(TripStatus.Ongoing);
    }
    return TripSeeder.ongoingTrips;
  }

  /**
   * Getter for the trips seed data singleton
   */
  static getTrips() {
    if (!TripSeeder.trips) {
      const trips: TripSeederPayload[] = [
        ...TripSeeder.getCompletedTrips(),
        ...TripSeeder.getOngoingTrips(),
      ];
      TripSeeder.trips = trips;
      const tripEmbeddedBookingsMap =
        BookingSeeder.getTripEmbeddedBookingsMap();
      for (const trip of trips) {
        trip.bookings = tripEmbeddedBookingsMap.get(trip._id.toString());
      }
    }
    return TripSeeder.trips;
  }
}
