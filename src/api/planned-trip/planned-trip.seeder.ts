import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { mongo } from 'mongoose';

import {
  PLANNED_TRIP_COLLECTION,
  PlannedTrip,
  PlannedTripModel,
} from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedBookingSeed } from '../booking/booking';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { TripSeeder } from '../trip/trip.seeder';
import { EmbeddedRouteSeed } from '../route/route';
import { TripPathSeed } from '../trip/trip';
import { PlannedTripStatus } from './planned-trip.constants';
import { BookingSeeder } from '../booking/booking.seeder';
import { getRandomInteger } from 'src/common/utils/number.utils';

export type PlannedTripSeederPayload = WithMongoId<
  ReplaceFields<
    PlannedTrip,
    {
      route: EmbeddedRouteSeed;
      path: TripPathSeed;
      bookings: EmbeddedBookingSeed[];
      vehicle: mongo.BSON.ObjectId;
      cooperative: mongo.BSON.ObjectId;
      drivers: mongo.BSON.ObjectId[];
    }
  >
>;

export class PlannedTripSeeder implements Seeder {
  // Planned trips seed data singleton
  private static plannedTrips: PlannedTripSeederPayload[] | null = null;

  constructor(
    @InjectModel(PlannedTrip.name) private plannedTripModel: PlannedTripModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.plannedTripModel.insertMany(PlannedTripSeeder.getPlannedTrips());
    await session.commitTransaction();
    console.log(`Seeded the \`${PLANNED_TRIP_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.plannedTripModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(PLANNED_TRIP_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${PLANNED_TRIP_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the planned seed data singleton
   */
  static getPlannedTrips() {
    if (!PlannedTripSeeder.plannedTrips) {
      const plannedTrips: PlannedTripSeederPayload[] = [];
      for (const trip of TripSeeder.getOngoingTrips()) {
        const startsAt = new Date(
          trip.startedAt.getTime() +
            (trip.route.approxDuration * 60 + 6 * 60 * 60) * 1000,
        );
        if (startsAt.getHours() > 20) {
          startsAt.setDate(startsAt.getDate() + 1);
        }
        const hours = getRandomInteger(20, 7);
        startsAt.setHours(hours);
        startsAt.setMinutes(0);
        const plannedTrip: PlannedTripSeederPayload = {
          _id: new mongo.ObjectId(),
          route: trip.route,
          path: {
            from: trip.path.to,
            to: trip.path.from,
          },
          startsAt: startsAt,
          bookings: [],
          status: PlannedTripStatus.Filling,
          drivers: trip.drivers,
          vehicle: trip.vehicle,
          cooperative: trip.cooperative,
          checkoutDelay: 30,
        };
        plannedTrips.push(plannedTrip);
      }
      PlannedTripSeeder.plannedTrips = plannedTrips;
      const plannedTripEmbeddedBookingsMap =
        BookingSeeder.getPlannedTripEmbeddedBookingsMap();
      for (const plannedTrip of plannedTrips) {
        plannedTrip.bookings = plannedTripEmbeddedBookingsMap.get(
          plannedTrip._id.toString(),
        );
      }
    }
    return PlannedTripSeeder.plannedTrips;
  }
}
