import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trip, TripModel, TripDocument } from './schema';
import {
  PagePaginated,
  PagePaginationParams,
  SortParams,
} from 'src/common/types/query';
import { FilterQuery, Types } from 'mongoose';
import { TripStatus } from './trip.constants';

export type GetTripsParams = PagePaginationParams &
  SortParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    fromCityId: Types.ObjectId | string;
    fromParkingLotId: Types.ObjectId | string;
    toCityId: Types.ObjectId | string;
    toParkingLotId: Types.ObjectId | string;
    closedPath: boolean;
    status: TripStatus;
  }>;

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: TripModel) {}

  async get({
    page,
    limit,
    sortBy,
    order,
    cooperativeId,
    fromCityId,
    toCityId,
    closedPath = false,
    status,
  }: GetTripsParams): Promise<PagePaginated<TripDocument>> {
    const filters: FilterQuery<Trip> = {};
    cooperativeId && (filters.cooperative = cooperativeId);
    if (!closedPath) {
      const pathFilters: FilterQuery<Trip>[] = [];
      fromCityId && pathFilters.push({ ['path.from._id']: fromCityId });
      toCityId && pathFilters.push({ ['path.to._id']: toCityId });
      if (pathFilters.length > 0) filters.$or = pathFilters;
    } else {
      fromCityId && (filters['path.from._id'] = fromCityId);
      toCityId && (filters['path.to._id'] = toCityId);
    }
    status && (filters.status = status);

    const count = await this.tripModel.countDocuments(filters);

    const trips = await this.tripModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort([[sortBy, order]])
      .populate(['vehicle', 'drivers', 'cooperative']);

    return {
      page,
      limit,
      count,
      items: trips,
    };
  }
}
