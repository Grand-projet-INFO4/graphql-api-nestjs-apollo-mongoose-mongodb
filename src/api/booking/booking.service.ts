import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Booking, BookingDocument, BookingModel } from './schema';
import { BaseQueryParams, PagePaginated } from 'src/common/types/query';
import { BookingMode } from './booking.constants';

export type GetBookingsParams = BaseQueryParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    plannedTripId: Types.ObjectId | string;
    tripId: Types.ObjectId | string;
    mode: BookingMode;
  }>;

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: BookingModel) {}

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
}
