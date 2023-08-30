import { Injectable } from '@nestjs/common';
import { Cooperative, CooperativeDocument, CooperativeModel } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { BatchOneFn, HasDataLoaders } from 'src/dataloader/dataloader';
import * as DataLoader from 'dataloader';
import { Types } from 'mongoose';

@Injectable()
export class CooperativeDataLoader implements HasDataLoaders {
  constructor(
    @InjectModel(Cooperative.name) private cooperativeModel: CooperativeModel,
  ) {}

  getDataLoaders() {
    return {
      cooperativeHavingId: new DataLoader(this.batchCooperativeHavingId),
    };
  }

  batchCooperativeHavingId: BatchOneFn<
    CooperativeDocument,
    Types.ObjectId | string
  > = async (ids) => {
    const cooperatives = (await this.cooperativeModel
      .find({
        _id: { $in: ids },
      })
      .lean()) as CooperativeDocument[];
    const cooperativeMap = new Map<string, CooperativeDocument>();
    for (const cooperative of cooperatives) {
      cooperativeMap.set(cooperative._id.toString(), cooperative);
    }
    return ids.map<CooperativeDocument>(
      (id) => cooperativeMap.get(id.toString()) ?? null,
    );
  };
}
