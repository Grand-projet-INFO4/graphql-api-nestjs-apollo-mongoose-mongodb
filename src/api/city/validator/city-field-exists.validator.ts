import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidatorConstraint } from 'class-validator';

import { FieldExistsValidator } from 'src/common/validators';
import { City, CityModel } from '../schema';

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class CityFieldExistsValidator extends FieldExistsValidator {
  constructor(@InjectModel(City.name) private cityModel: CityModel) {
    super();
  }

  async checkIfExists(field: '_id', value: string): Promise<boolean> {
    return !!(await this.cityModel.findOne({ [field]: value }));
  }
}
