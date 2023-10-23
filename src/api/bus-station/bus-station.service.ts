import { Injectable, NotFoundException } from '@nestjs/common';
import { Types, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BusStation, BusStationDocument, BusStationModel } from './schema';
import { BaseQueryParams, PagePaginated } from 'src/common/types/query';
import { ConfigService } from '@nestjs/config';
import {
  IMAGES_DIR,
  STATIC_FILES_URL_PREFIX,
} from 'src/common/constants/static-files.constants';
import { BUS_STATIONS_PHOTOS_DIR } from './bus-station.constants';
import { GeoJSONType } from 'src/common/constants/geojson.constants';
import { BoundingsBoxInput } from 'src/common/types/geojson';
import { getBoundingsBoxPolygon } from 'src/common/utils/geojson.utils';

export type GetBusStationsParams = BaseQueryParams & {
  highways?: string[];
  cityId?: Types.ObjectId | string;
  regionId?: Types.ObjectId | string;
  nearPoint?: [number, number];
  boundingsBox?: BoundingsBoxInput;
};

@Injectable()
export class BusStationService {
  constructor(
    @InjectModel(BusStation.name) private busStationModel: BusStationModel,
    private configService: ConfigService,
  ) {}

  async get({
    page,
    limit,
    search,
    text,
    cityId,
    regionId,
    highways,
    nearPoint,
    boundingsBox,
    sortBy = 'updatedAt',
    order = 'asc',
  }: GetBusStationsParams): Promise<PagePaginated<BusStationDocument>> {
    const filters: FilterQuery<BusStation> = {};
    search && (filters.stationName = new RegExp(search, 'i'));
    text && (filters.$text = { $search: text });
    cityId && (filters['city._id'] = cityId);
    regionId && (filters['city.region._id'] = regionId);
    highways && (filters.highways = { $in: highways });
    boundingsBox &&
      (filters.position = {
        $geoWithin: {
          $geometry: {
            type: GeoJSONType.Polygon,
            coordinates: getBoundingsBoxPolygon(boundingsBox),
          },
        },
      });

    const count = await this.busStationModel.countDocuments(filters);

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

    let query = this.busStationModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    // We should not explicitly sort the query
    // if the $geoWithin or $nearSphere filter operators are used
    if (!nearPoint && !boundingsBox) {
      query = query.sort([
        ['city.weight', 'desc'],
        [sortBy, order],
      ]);
    }

    const busStations = await query.exec();

    return {
      page,
      limit,
      count,
      items: busStations,
    };
  }

  /**
   * Gets a bus station from one its identifier fields
   *
   * @param identifier The identifier field's value. It could be the id or the slug.
   */
  async getOne(
    identifier: Types.ObjectId | string,
  ): Promise<BusStationDocument> {
    const filters: FilterQuery<BusStation> = {};
    if (typeof identifier === 'string') {
      filters.$or = [{ _id: identifier }, { slug: identifier }];
    } else {
      filters._id = identifier;
    }
    const busStation = await this.busStationModel.findOne(filters);
    if (!busStation) {
      throw new NotFoundException('Could not find the bus station');
    }
    return busStation;
  }

  /**
   * Gets the full URL of a bus station's photo from its filename
   *
   * @param filename The photo's filename
   */
  getBusStationPhotoURL(filename: string): string {
    return (
      this.configService.get('APP_URL') +
      [
        STATIC_FILES_URL_PREFIX,
        IMAGES_DIR,
        BUS_STATIONS_PHOTOS_DIR,
        filename,
      ].join('/')
    );
  }
}
