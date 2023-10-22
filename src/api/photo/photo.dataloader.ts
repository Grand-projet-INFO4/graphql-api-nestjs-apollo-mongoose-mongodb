import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as DataLoader from 'dataloader';
import { Types } from 'mongoose';

import { BatchOneFn, HasDataLoaders } from 'src/dataloader/dataloader';
import {
  CooperativePhoto,
  CooperativePhotoDocument,
  CooperativePhotoModel,
} from './schema';

@Injectable()
export class PhotoDataLoader implements HasDataLoaders {
  constructor(
    @InjectModel(CooperativePhoto.name)
    private cooperativePhotoModel: CooperativePhotoModel,
  ) {}

  getDataLoaders() {
    return {
      cooperativePhotoHavingId: new DataLoader(
        this.batchCooperativePhotoHavingId,
      ),
    };
  }

  batchCooperativePhotoHavingId: BatchOneFn<
    CooperativePhotoDocument,
    Types.ObjectId | string
  > = async (ids) => {
    const photos = (await this.cooperativePhotoModel
      .find({
        _id: { $in: ids },
      })
      .lean()) as CooperativePhotoDocument[];
    const photoMap = new Map<string, CooperativePhotoDocument>();
    for (const photo of photos) {
      photoMap.set(photo._id.toString(), photo);
    }
    return ids.map<CooperativePhotoDocument>(
      (id) => photoMap.get(id.toString()) ?? null,
    );
  };
}
