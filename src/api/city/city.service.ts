import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { City, CityModel } from './schema';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: CityModel) {}

  async getOne(id: Types.ObjectId | string) {
    const city = await this.cityModel.findById(id);
    if (!city) {
      throw new NotFoundException('Could not find the city');
    }
    return city;
  }
}
