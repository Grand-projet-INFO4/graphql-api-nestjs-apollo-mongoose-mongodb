import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Types } from 'mongoose';

import { City, CityDocument, CityModel } from './schema';
import { BaseQueryParams, PagePaginated } from 'src/common/types/query';

export type GetCitiesQueryParams = BaseQueryParams & {
  regionId?: Types.ObjectId | string;
  weight?: number;
};

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: CityModel) {}

  async get({
    page,
    limit,
    search,
    text,
    regionId,
    weight,
    sortBy = 'cityName',
    order = 'asc',
  }: GetCitiesQueryParams): Promise<PagePaginated<CityDocument>> {
    const filters: FilterQuery<City> = {};
    regionId && (filters['region._id'] = regionId);
    weight && (filters.weight = weight);
    text && (filters['$text'] = { $search: text });
    if (search) {
      const regExp = new RegExp(search, "i");
      filters.$or = [
        { cityName: regExp },
        { ['region.regionName']: regExp },
        { ['region.province']: regExp },
      ];
    }

    const count = await this.cityModel.countDocuments(filters);
    const cities = await this.cityModel
      .find(filters)
      .sort({ weight: 'descending', [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      page,
      limit,
      count,
      items: cities,
    };
  }

  async getOne(id: Types.ObjectId | string) {
    const city = await this.cityModel.findById(id);
    if (!city) {
      throw new NotFoundException('Could not find the city');
    }
    return city;
  }
}
