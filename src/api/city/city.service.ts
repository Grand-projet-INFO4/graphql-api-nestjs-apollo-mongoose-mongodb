import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import {
  City,
  CityDocument,
  CityModel,
  EmbeddedCity,
  EmbeddedCityDocument,
  EmbeddedCityModel,
} from './schema';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name) private cityModel: CityModel,
    @InjectModel(EmbeddedCity.name)
    private EmbeddedcityModel: EmbeddedCityModel,
  ) {}

  async getOne(id: Types.ObjectId | string) {
    const city = await this.cityModel.findById(id);
    if (!city) {
      throw new NotFoundException('Could not find the city');
    }
    return city;
  }

  /**
   * Parses a city document to its embedded city document version
   *
   * @param city A city document
   * @returns The corresponding embedded city document
   */
  toEmbeddedCity(city: CityDocument): EmbeddedCityDocument {
    return new this.EmbeddedcityModel({
      _id: city._id,
      cityName: city.cityName,
      region: city.region,
    });
  }

  /**
   * Gets a city by id then Parses the city document to its embedded city document version
   *
   * @param city A city document
   * @returns The corresponding embedded city document
   */
  async toEmbeddedCityFromId(
    id: Types.ObjectId | string,
  ): Promise<EmbeddedCityDocument> {
    return this.toEmbeddedCity(await this.getOne(id));
  }
}
