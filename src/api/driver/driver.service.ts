import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, SortOrder, Types } from 'mongoose';

import { BaseQueryParams, PagePaginated } from 'src/common/types/query';
import { DriverLicenseCategory } from './driver';
import { Driver, DriverDocument, DriverModel } from './schema';
import { InjectModel } from '@nestjs/mongoose';

export type GetDriversParams = BaseQueryParams & {
  cooperativeId?: Types.ObjectId | string;
  licenseCategories?: DriverLicenseCategory[];
};

@Injectable()
export class DriverService {
  constructor(@InjectModel(Driver.name) private driverModel: DriverModel) {}

  async get({
    page,
    limit,
    search,
    text,
    cooperativeId,
    licenseCategories,
    sortBy = 'hiredAt',
    order = 'desc',
  }: GetDriversParams): Promise<PagePaginated<DriverDocument>> {
    // We write the filters data inside this `andFilters` array that will the value of the `$and` operator
    // because some filters use the `$or` operator
    const andFilters: FilterQuery<Driver>[] = [];
    if (search) {
      const pattern = new RegExp(search, 'i');
      andFilters.push({
        $or: [{ firstName: pattern }, { lastName: pattern }],
      });
    }
    text &&
      andFilters.push({
        $text: {
          $search: text,
        },
      });
    cooperativeId &&
      andFilters.push({
        cooperative: cooperativeId,
      });
    licenseCategories &&
      andFilters.push({
        'license.categories': {
          $in: licenseCategories,
        },
      });
    const filters: FilterQuery<Driver> =
      andFilters.length > 0 ? { $and: andFilters } : {};

    const sort: Record<string, SortOrder> =
      sortBy === 'fullName'
        ? { lastName: order, firstName: order }
        : { [sortBy]: order };

    const count = await this.driverModel.countDocuments(filters);
    const drivers = await this.driverModel
      .find(filters)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      page,
      limit,
      count,
      items: drivers,
    };
  }

  /**
   * Gets a driver by one of its identifier fields
   *
   * @param identifier The identifier field. It could be the id the driver license id.
   */
  async getOne(identifier: Types.ObjectId | string) {
    const filters: FilterQuery<Driver> = {};
    if (typeof identifier === 'string') {
      filters.$or = [{ _id: identifier }, { 'license.licenseId': identifier }];
    } else {
      filters._id = identifier;
    }
    const driver = this.driverModel
      .findOne(filters)
      .populate(['user', 'cooperative', 'ongoingTrip', 'vehicle']);
    if (!driver) {
      throw new NotFoundException('Could not find the driver');
    }
    return driver;
  }
}
