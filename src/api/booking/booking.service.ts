import { Injectable } from '@nestjs/common';
import { AnyKeys, FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Booking, BookingDocument, BookingModel } from './schema';
import { BaseQueryParams, PagePaginated } from 'src/common/types/query';
import { BookingMode } from './booking.constants';
import { AddBookingDTO } from './dto';
import {
  PlannedTrip,
  PlannedTripDocument,
  PlannedTripModel,
} from '../planned-trip/schema';

export type GetBookingsParams = BaseQueryParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    plannedTripId: Types.ObjectId | string;
    tripId: Types.ObjectId | string;
    mode: BookingMode;
  }>;

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: BookingModel,
    @InjectModel(PlannedTrip.name) private plannedTripModel: PlannedTripModel,
  ) {}

  async get({
    page,
    limit,
    sortBy,
    order,
    text,
    cooperativeId,
    plannedTripId,
    tripId,
    mode,
  }: GetBookingsParams): Promise<PagePaginated<BookingDocument>> {
    const filters: FilterQuery<Booking> = {};
    text && (filters.$text = { $search: text });
    cooperativeId && (filters.cooperative = cooperativeId);
    plannedTripId && (filters.plannedTrip = plannedTripId);
    tripId && (filters.trip = tripId);
    mode && (filters.mode = mode);

    const count = await this.bookingModel.countDocuments(filters);
    const bookings = await this.bookingModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort([[sortBy, order]])
      .populate(['plannedTrip', 'trip', 'user', 'parkingLot']);

    return {
      page,
      limit,
      count,
      items: bookings,
    };
  }

  async create(payload: AddBookingDTO) {
    const plannedTrip = (await this.plannedTripModel.findById(
      payload.plannedTripId,
    )) as PlannedTripDocument;
    const fee = plannedTrip.route.fee * payload.seats.length;
    const data: AnyKeys<Booking> = {
      personName: payload.personName,
      phone: payload.phone,
      mode: payload.mode as unknown as BookingMode,
      plannedTrip: payload.plannedTripId,
      seats: payload.seats,
      payment: {
        amount: fee,
        method: payload.paymentMethod,
        service: payload.paymentService,
        paidAt: new Date(),
      },
      cooperative: plannedTrip.cooperative,
    };
    payload.email && (data.email = payload.email);
    payload.parkingLotId && (data.parkingLot = payload.parkingLotId);

    const booking = await this.bookingModel.create(data);

    await booking.populate(['plannedTrip', 'trip', 'user', 'parkingLot']);

    return booking;
  }
}
