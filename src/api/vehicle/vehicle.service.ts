import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { Vehicle, VehicleDocument, VehicleModel } from './schema';
import {
  PagePaginated,
  PagePaginationParams,
  SortParams,
} from 'src/common/types/query';
import { BoundingsBoxInput } from 'src/common/types/geojson';
import { GeoJSONType } from 'src/common/constants/geojson.constants';
import { getBoundingsBoxPolygon } from 'src/common/utils/geojson.utils';
import { CooperativeDocument } from '../cooperative/schema';
import { DriverDocument } from '../driver/schema';
import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { VEHICLES_PHOTOS_DIR } from './vehicle.constants';

export type GetVehiclesParams = PagePaginationParams &
  SortParams &
  Partial<{
    cooperativeId: Types.ObjectId | string;
    nearPoint: [number, number];
    boundingsBox: BoundingsBoxInput;
  }>;

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: VehicleModel,
    private configService: ConfigService,
  ) {}

  async get({
    page,
    limit,
    sortBy,
    order,
    cooperativeId,
    nearPoint,
    boundingsBox,
  }: GetVehiclesParams): Promise<PagePaginated<VehicleDocument>> {
    const filters: FilterQuery<Vehicle> = {};
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

    const count = await this.vehicleModel.countDocuments(filters);

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

    let query = this.vehicleModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'ongoingTrip',
        populate: { path: 'route.parkingLots.busStation' },
      })
      .populate<{
        cooperative: CooperativeDocument;
        drivers: DriverDocument[];
      }>(['cooperative', 'drivers']);
    // We should not explicitly sort the query
    // if the $geoWithin or $nearSphere filter operators are used
    if (!nearPoint && !boundingsBox) {
      query = query.sort([[sortBy, order]]);
    }

    const vehicles = await query.exec();

    return {
      page,
      limit,
      count,
      items: vehicles,
    };
  }

  /**
   * Gets the full URL of a vehicle's photo from its photo's filename
   */
  getVehiclePhotoURL(filename: string): string {
    return (
      this.configService.get('APP_URL') +
      [STATIC_FILES_URL_PREFIX, IMAGES_DIR, VEHICLES_PHOTOS_DIR, filename].join(
        '/',
      )
    );
  }

  /**
   * Counts the total number of seats of a vehicle
   */
  countVehicleSeats(vehicle: VehicleDocument): number {
    let count: number =
      vehicle.seatsCount.front +
      vehicle.seatsCount.rearCols * vehicle.seatsCount.rearRows;
    vehicle.removedSeats && (count += vehicle.removedSeats.length);
    return count;
  }
}
