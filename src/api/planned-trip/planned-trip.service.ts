import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Types } from 'mongoose';

import { PlannedTrip, PlannedTripDocument, PlannedTripModel } from './schema';
import {
  PagePaginated,
  PagePaginationParams,
  SortParams,
} from 'src/common/types/query';
import { PlannedTripStatus } from './planned-trip.constants';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleDocument } from '../vehicle/schema';

export type GetPlannedTripsParams = PagePaginationParams &
  SortParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    fromCityId: Types.ObjectId | string;
    fromParkingLotId: Types.ObjectId | string;
    toCityId: Types.ObjectId | string;
    toParkingLotId: Types.ObjectId | string;
    closedPath: boolean;
    status: PlannedTripStatus;
    startsAfter: Date | string;
    availSeatsCount: number;
  }>;

@Injectable()
export class PlannedTripService {
  constructor(
    @InjectModel(PlannedTrip.name) private plannedTripModel: PlannedTripModel,
    private vehicleService: VehicleService,
  ) {}

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
    startsAfter,
  }: GetPlannedTripsParams): Promise<PagePaginated<PlannedTripDocument>> {
    const filters: FilterQuery<PlannedTrip> = {};
    cooperativeId && (filters.cooperative = cooperativeId);
    if (!closedPath) {
      const pathFilters: FilterQuery<PlannedTrip>[] = [];
      fromCityId && pathFilters.push({ ['path.from._id']: fromCityId });
      toCityId && pathFilters.push({ ['path.to._id']: toCityId });
      if (pathFilters.length > 0) filters.$or = pathFilters;
    } else {
      fromCityId && (filters['path.from._id'] = fromCityId);
      toCityId && (filters['path.to._id'] = toCityId);
    }
    status && (filters.status = status);
    startsAfter &&
      (filters.startsAt = {
        $gte:
          typeof startsAfter === 'string' ? new Date(startsAfter) : startsAfter,
      });

    const count = await this.plannedTripModel.countDocuments(filters);

    const plannedTrips = await this.plannedTripModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort([[sortBy, order]])
      .populate(['vehicle', 'drivers', 'cooperative']);

    return {
      page,
      limit,
      count,
      items: plannedTrips,
    };
  }

  /**
   * Counts the number of availabale seats of a trip's vehicle
   */
  countAvailableSeats(plannedTrip: PlannedTripDocument): number {
    const takenSeatsCount = plannedTrip.bookings.reduce(
      (sum, booking) => sum + booking.seats.length,
      0,
    );
    let count =
      this.vehicleService.countVehicleSeats(
        plannedTrip.vehicle as VehicleDocument,
      ) - takenSeatsCount;
    plannedTrip.reservedSeats && (count -= plannedTrip.reservedSeats.length);
    return count;
  }
}
