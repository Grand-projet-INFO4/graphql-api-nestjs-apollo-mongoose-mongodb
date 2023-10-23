import { Injectable } from '@nestjs/common';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  PagePaginated,
  PagePaginationParams,
  SortParams,
} from 'src/common/types/query';
import { Route, RouteDocument, RouteModel } from './schema';
import { PARKING_LOT_COLLECTION, ParkingLot } from '../parking-lot/schema';

export type GetRoutesParams = PagePaginationParams &
  SortParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    parkingLotId: Types.ObjectId | string;
    cityId: Types.ObjectId | string;
    highways: string[];
  }>;

@Injectable()
export class RouteService {
  constructor(@InjectModel(Route.name) private routeModel: RouteModel) {}

  async get({
    page,
    limit,
    sortBy,
    order,
    cooperativeId,
    cityId,
    highways,
    parkingLotId,
  }: GetRoutesParams): Promise<PagePaginated<RouteDocument>> {
    const filters: FilterQuery<Route> = {};
    cooperativeId && (filters.cooperative = cooperativeId);
    highways &&
      (filters.highways = {
        $in: highways,
      });
    parkingLotId && (filters.parkingLots = parkingLotId);

    const parkingLotsFilters: FilterQuery<ParkingLot> = {};
    cityId && (parkingLotsFilters['city._id'] = cityId);

    const aggrPipeline: PipelineStage[] = [
      {
        $match: filters,
      },
      {
        $sort: {
          [sortBy]: order === 'asc' || order === 'ascending' ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: PARKING_LOT_COLLECTION,
          localField: 'parkingLots',
          foreignField: '_id',
          as: 'parkingLots',
        },
      },
      {
        $match: {
          parkingLots: {
            $elemMatch: parkingLotsFilters,
          },
        },
      },
    ];

    const [{ routesCount }] = await this.routeModel.aggregate<{
      routesCount: number;
    }>([
      ...aggrPipeline,
      {
        $count: 'routesCount',
      },
    ]);

    const routes = await this.routeModel.aggregate<RouteDocument>(aggrPipeline);

    return {
      page,
      limit,
      count: routesCount,
      items: routes,
    };
  }
}
