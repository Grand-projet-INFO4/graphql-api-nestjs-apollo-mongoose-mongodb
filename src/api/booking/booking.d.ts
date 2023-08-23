import { mongo } from 'mongoose';

import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedBooking } from './schema';

export type EmbeddedBookingSeed = WithMongoId<
  ReplaceFields<
    EmbeddedBooking,
    {
      parkingLot?: mongo.BSON.ObjectId;
      user?: mongo.BSON.ObjectId;
    }
  >
>;
