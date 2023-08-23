import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';
import { faker } from '@faker-js/faker';

import { BOOKING_COLLECTION, Booking, BookingModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { TripSeeder, TripSeederPayload } from '../trip/trip.seeder';
import { EmbeddedVehicleSeed } from '../vehicle/vehicle';
import {
  getRandomBoolean,
  getRandomInteger,
} from 'src/common/utils/number.utils';
import {
  BookingMode,
  BookingPersonAttendance,
  BookingStatus,
} from './booking.constants';
import { EmbeddedParkingLotSeed } from '../parking-lot/parking-lot';
import { PaymentMethod } from 'src/common/constants/payment.constants';
import { Payment } from 'src/common/schemas/payment.schema';
import {
  PlannedTripSeeder,
  PlannedTripSeederPayload,
} from '../planned-trip/planned-trip.seeder';
import { VehicleSeeder } from '../vehicle/vehicle.seeder';
import { EmbeddedBookingSeed } from './booking';

export type BookingSeederPayload = WithMongoId<
  ReplaceFields<
    Booking,
    {
      plannedTrip?: mongo.BSON.ObjectId;
      trip?: mongo.BSON.ObjectId;
      cooperative: mongo.BSON.ObjectId;
      parkingLot?: mongo.BSON.ObjectId;
      user?: mongo.BSON.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    }
  >
>;

type GenerateTripBookingsParams =
  | { type: 'Trip'; trip: TripSeederPayload }
  | { type: 'PlannedTrip'; trip: PlannedTripSeederPayload };

const secretCode =
  '$2b$10$nJfd6hRMhJEiPHDqktCZWuSaYuV1v3a/yyr/NGnn2s55ETYcvpMPG'; // Clear text: "123456"

export class BookingSeeder implements Seeder {
  // Bookings seed data singleton
  private static bookings: BookingSeederPayload[] | null = null;

  // Trips bookings seed data singleton
  private static tripsBookings: BookingSeederPayload[] | null = null;

  // Planned trips bookings seed data singleton
  private static plannedTripsBookings: BookingSeederPayload[] | null = null;

  // Map of trip id key and trip embedded bookings value singleton
  private static tripEmbeddedBookingsMap: Map<
    string,
    EmbeddedBookingSeed[]
  > | null = null;

  // Map of planned trip id key and planned trip embedded bookings value singleton
  private static plannedTripEmbeddedBookingsMap: Map<
    string,
    EmbeddedBookingSeed[]
  > | null = null;

  constructor(
    @InjectModel(Booking.name) private bookingModel: BookingModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.bookingModel.insertMany(BookingSeeder.getBookings());
    await session.commitTransaction();
    console.log(`Seeded the \`${BOOKING_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.bookingModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection(BOOKING_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${BOOKING_COLLECTION}\` collection ...`);
  }

  /**
   * Generates random bookings seats chunks for a given vehicle
   */
  static generateVehicleBookingsSeatsChunks(
    vehicle: EmbeddedVehicleSeed,
    isFull = true,
  ): string[][] {
    const availableSeats: string[] = [];
    let seatsCount = 0;
    for (let i = 0; i < vehicle.seatsCount.front; i++) {
      const seat = String.fromCharCode(65 + i);
      if (
        !vehicle.removedSeats ||
        (vehicle.removedSeats && !vehicle.removedSeats.includes(seat))
      ) {
        availableSeats.push(seat);
        seatsCount++;
      }
    }
    for (let row = 1; row <= vehicle.seatsCount.rearRows; row++) {
      for (let col = 1; col <= vehicle.seatsCount.rearCols; col++) {
        const seat = `${row}${col}`;
        if (
          !vehicle.removedSeats ||
          (vehicle.removedSeats && !vehicle.removedSeats.includes(seat))
        ) {
          availableSeats.push(seat);
          seatsCount++;
        }
      }
    }
    const seatsChunks: string[][] = [];
    if (!isFull) {
      seatsCount = getRandomInteger(seatsCount - 1, 1);
    }
    for (let bookingsCount = 0; bookingsCount < seatsCount; ) {
      const seats: string[] = [];
      const count = Math.min(
        seatsCount - bookingsCount,
        getRandomInteger(5, 1),
      );
      for (let i = 0; i < count; i++) {
        const randIndex = getRandomInteger(availableSeats.length - 1, 0);
        seats.push(availableSeats.splice(randIndex, 1)[0]);
      }
      seatsChunks.push(seats);
      bookingsCount += count;
    }
    return seatsChunks;
  }

  /**
   * Generates a trip's bookings depending on whether it is a trip or a planned trip
   */
  static generateTripBookings({
    type,
    trip,
  }: GenerateTripBookingsParams): BookingSeederPayload[] {
    const tripBookings: BookingSeederPayload[] = [];
    let vehicle: EmbeddedVehicleSeed;
    if (type === 'PlannedTrip') {
      const vehicleMap = VehicleSeeder.getVehicleMapById();
      vehicle = VehicleSeeder.parseEmbeddedVehicleSeed(
        vehicleMap.get(trip.vehicle.toString()),
      );
    } else {
      vehicle = trip.currentVehicle;
    }
    const seatsChunks = BookingSeeder.generateVehicleBookingsSeatsChunks(
      vehicle,
      type === 'Trip',
    );
    for (const seats of seatsChunks) {
      const mode = [BookingMode.InPerson, BookingMode.Online][
        getRandomBoolean()
      ];
      const bookedAt = faker.date.recent({
        days: 5,
        refDate: trip.startsAt,
      });
      const payment: Payment = {
        amount: trip.route.fee * seats.length,
        method:
          mode === BookingMode.InPerson
            ? PaymentMethod.Cash
            : PaymentMethod.MobileMoney,
        paidAt: bookedAt,
      };
      if (payment.method === PaymentMethod.MobileMoney) {
        payment.service = ['Orange Money', 'Airtel Money', 'MVola'][
          getRandomInteger(2, 0)
        ];
      }
      const booking: BookingSeederPayload = {
        _id: new mongo.ObjectId(),
        personName: faker.person.fullName(),
        mode,
        seats,
        phone: faker.phone.number(
          ['034#######', '032#######', '033#######', '038#######'][
            getRandomInteger(3, 0)
          ],
        ),
        payment,
        attendance: BookingPersonAttendance.Confirmed,
        status: BookingStatus.Confirmed,
        cooperative: trip.cooperative,
        [type === 'Trip' ? 'trip' : 'plannedTrip']: trip._id,
        createdAt: bookedAt,
        updatedAt: bookedAt,
      };
      if (mode === BookingMode.Online) {
        booking.email = faker.internet.email();
        booking.secretCode = secretCode;
      } else {
        booking.parkingLot = (
          (trip.route.parkingLots as EmbeddedParkingLotSeed[]).find(
            (parkingLot) => {
              return (
                trip.path.from._id.toString() === parkingLot.city._id.toString()
              );
            },
          ) as EmbeddedParkingLotSeed
        )._id;
      }
      tripBookings.push(booking);
    }
    return tripBookings;
  }

  /**
   * Getter for the trips bookings seed data singleton
   */
  static getTripsBookings() {
    if (!BookingSeeder.tripsBookings) {
      const tripsBookings: BookingSeederPayload[] = [];
      for (const trip of TripSeeder.getTrips()) {
        const bookings = BookingSeeder.generateTripBookings({
          type: 'Trip',
          trip,
        });
        for (const booking of bookings) {
          tripsBookings.push(booking);
        }
      }
      BookingSeeder.tripsBookings = tripsBookings;
    }
    return BookingSeeder.tripsBookings;
  }

  /**
   * Getter for the planned trips bookings seed data singleton
   */
  static getPlannedTripsBookings() {
    if (!BookingSeeder.plannedTripsBookings) {
      const plannedTripsBookings: BookingSeederPayload[] = [];
      for (const trip of PlannedTripSeeder.getPlannedTrips()) {
        const bookings = BookingSeeder.generateTripBookings({
          type: 'PlannedTrip',
          trip,
        });
        for (const booking of bookings) {
          plannedTripsBookings.push(booking);
        }
      }
      BookingSeeder.plannedTripsBookings = plannedTripsBookings;
    }
    return BookingSeeder.plannedTripsBookings;
  }

  /**
   * Getter for the bookings seed data singleton
   */
  static getBookings() {
    if (!BookingSeeder.bookings) {
      const bookings: BookingSeederPayload[] = [
        ...BookingSeeder.getTripsBookings(),
        ...BookingSeeder.getPlannedTripsBookings(),
      ];
      BookingSeeder.bookings = bookings;
    }
    return BookingSeeder.bookings;
  }

  /**
   * Parses an booking seed data into its embedded booking seed version
   */
  static parseEmbeddedBookingSeed(
    booking: BookingSeederPayload,
  ): EmbeddedBookingSeed {
    const embeddedBooking: EmbeddedBookingSeed = {
      _id: booking._id,
      personName: booking.personName,
      mode: booking.mode,
      payment: booking.payment,
      attendance: booking.attendance,
      phone: booking.phone,
      seats: booking.seats,
    };
    booking.email && (embeddedBooking.email = booking.email);
    booking.parkingLot && (embeddedBooking.parkingLot = booking.parkingLot);
    booking.secretCode && (embeddedBooking.secretCode = booking.secretCode);
    return embeddedBooking;
  }

  /**
   * Getter for the trip embedded bookings map singleton
   */
  static getTripEmbeddedBookingsMap() {
    if (!BookingSeeder.tripEmbeddedBookingsMap) {
      const tripEmbeddedBookingsMap = new Map<string, EmbeddedBookingSeed[]>();
      for (const booking of BookingSeeder.getTripsBookings()) {
        const tripId = (booking.trip as mongo.BSON.ObjectId).toString();
        let tripEmbeddedBookings = tripEmbeddedBookingsMap.get(tripId);
        if (!tripEmbeddedBookings) {
          tripEmbeddedBookings = [];
          tripEmbeddedBookingsMap.set(tripId, tripEmbeddedBookings);
        }
        tripEmbeddedBookings.push(
          BookingSeeder.parseEmbeddedBookingSeed(booking),
        );
      }
      BookingSeeder.tripEmbeddedBookingsMap = tripEmbeddedBookingsMap;
    }
    return BookingSeeder.tripEmbeddedBookingsMap;
  }

  /**
   * Getter for the planned trip embedded bookings map singleton
   */
  static getPlannedTripEmbeddedBookingsMap() {
    if (!BookingSeeder.plannedTripEmbeddedBookingsMap) {
      const plannedTripEmbeddedBookingsMap = new Map<
        string,
        EmbeddedBookingSeed[]
      >();
      for (const booking of BookingSeeder.getPlannedTripsBookings()) {
        const tripId = (booking.plannedTrip as mongo.BSON.ObjectId).toString();
        let tripEmbeddedBookings = plannedTripEmbeddedBookingsMap.get(tripId);
        if (!tripEmbeddedBookings) {
          tripEmbeddedBookings = [];
          plannedTripEmbeddedBookingsMap.set(tripId, tripEmbeddedBookings);
        }
        tripEmbeddedBookings.push(
          BookingSeeder.parseEmbeddedBookingSeed(booking),
        );
      }
      BookingSeeder.plannedTripEmbeddedBookingsMap =
        plannedTripEmbeddedBookingsMap;
    }
    return BookingSeeder.plannedTripEmbeddedBookingsMap;
  }
}
