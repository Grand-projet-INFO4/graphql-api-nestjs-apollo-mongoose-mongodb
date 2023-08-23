import { mongo } from 'mongoose';

import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedVehicle } from './schema';
import { EmbeddedCarModelSeed } from '../car-model/car-model';

export type EmbeddedVehicleSeed = WithMongoId<
  ReplaceFields<
    EmbeddedVehicle,
    {
      cooperative: mongo.BSON.ObjectId;
      model: EmbeddedCarModelSeed;
    }
  >
>;
