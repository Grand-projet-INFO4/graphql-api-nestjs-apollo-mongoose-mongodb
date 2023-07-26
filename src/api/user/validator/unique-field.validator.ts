import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidatorConstraint } from 'class-validator';

import { UniqueFieldValidator } from 'src/common/validators';
import { User, UserModel } from '../schema';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueUserFieldValidator extends UniqueFieldValidator {
  constructor(@InjectModel(User.name) private userModel: UserModel) {
    super();
  }

  async checkUnique(
    field: '_id' | 'email' | 'username' | 'phone',
    value: string,
  ): Promise<boolean> {
    return !(await this.userModel.findOne({ [field]: value }));
  }
}
