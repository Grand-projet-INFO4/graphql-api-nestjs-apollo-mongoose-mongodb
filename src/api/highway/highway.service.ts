import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Highway, HighwayDocument, HighwayModel } from './schema';
import { SortParams, TextSearchParams } from 'src/common/types/query';

export type GetHighwaysParams = SortParams & TextSearchParams;

@Injectable()
export class HighwayService {
  constructor(@InjectModel(Highway.name) private highwayModel: HighwayModel) {}

  async get({
    text,
    sortBy = 'no',
    order = 'asc',
  }: GetHighwaysParams): Promise<HighwayDocument[]> {
    const filters: FilterQuery<Highway> = {};
    text && (filters.$text = { $search: text });
    return this.highwayModel.find(filters).sort({ [sortBy]: order });
  }

  /**
   * Gets a highway by one of its identifier fields
   *
   * @param identifier The identifier field. It can be either the "_id" or the "no" field
   */
  async getOne(identifier: Types.ObjectId | string): Promise<HighwayDocument> {
    const filters: FilterQuery<Highway> = {};
    if (typeof identifier === 'string') {
      filters.$or = [{ _id: identifier }, { no: identifier }];
    } else {
      filters._id = identifier;
    }
    const highway = await this.highwayModel.findOne(filters);
    if (!highway) {
      throw new NotFoundException('Could not find the highway');
    }
    return highway;
  }
}
