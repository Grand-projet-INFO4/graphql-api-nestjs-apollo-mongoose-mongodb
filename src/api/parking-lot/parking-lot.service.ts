import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BoundingsBoxInput } from 'src/common/types/geojson';
import {
  PagePaginated,
  PagePaginationParams,
  SortParams,
} from 'src/common/types/query';
import { ParkingLot, ParkingLotDocument, ParkingLotModel } from './schema';
import { GeoJSONType } from 'src/common/constants/geojson.constants';
import { getBoundingsBoxPolygon } from 'src/common/utils/geojson.utils';
import { CooperativeDocument } from '../cooperative/schema';
import { CooperativePhotoDocument } from '../photo/schema';
import { BusStationDocument } from '../bus-station/schema';

export type GetParkingLotsParams = PagePaginationParams &
  SortParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    nearPoint: [number, number];
    boundingsBox: BoundingsBoxInput;
  }>;

@Injectable()
export class ParkingLotService {
  constructor(
    @InjectModel(ParkingLot.name) private parkingLotModel: ParkingLotModel,
  ) {}

  async get({
    page,
    limit,
    sortBy,
    order,
    cooperativeId,
    nearPoint,
    boundingsBox,
  }: GetParkingLotsParams): Promise<PagePaginated<ParkingLotDocument>> {
    const filters: FilterQuery<ParkingLot> = {};
    boundingsBox &&
      (filters.position = {
        $geoWithin: {
          $geometry: {
            type: GeoJSONType.Polygon,
            coordinates: getBoundingsBoxPolygon(boundingsBox),
          },
        },
      });
    cooperativeId && (filters.cooperative = cooperativeId);

    const count = await this.parkingLotModel.countDocuments(filters);

    // The `nearPoint` filter should not be passed to the `countDocuments()` as it throw an error
    nearPoint &&
      (filters.position = {
        $nearSphere: {
          $geometry: {
            type: GeoJSONType.Point,
            coordinates: nearPoint,
          },
        },
      });

    let query = this.parkingLotModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{
        cooperative: CooperativeDocument;
        mainPhoto: CooperativePhotoDocument;
        busStation: BusStationDocument;
      }>(['cooperative', 'mainPhoto', 'busStation']);
    // We should not explicitly sort the query
    // if the $geoWithin or $nearSphere filter operators are used
    if (!nearPoint && !boundingsBox) {
      query = query.sort([[sortBy, order]]);
    }

    const busStations = await query.exec();

    return {
      page,
      limit,
      count,
      items: busStations,
    };
  }
}
