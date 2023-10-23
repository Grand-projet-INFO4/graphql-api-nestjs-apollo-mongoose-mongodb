import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';

import { RegionModel, Region, RegionDocument } from './schema';
import { SortParams } from 'src/common/types/query';

export type GetRegionsParams = SortParams & {
  province?: string;
};

@Injectable()
export class RegionService {
  constructor(@InjectModel(Region.name) private regionModel: RegionModel) {}

  async get({
    sortBy,
    order,
    province,
  }: GetRegionsParams): Promise<RegionDocument[]> {
    const filters: FilterQuery<Region> = {};
    province && (filters.province = province);
    return this.regionModel.find(filters).sort({
      [sortBy]: order,
    });
  }
}
