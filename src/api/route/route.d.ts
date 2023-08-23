import { mongo } from 'mongoose';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedParkingLotSeed } from '../parking-lot/parking-lot';
import { EmbeddedRoute } from './schema';

export type EmbeddedRouteSeed = WithMongoId<
  ReplaceFields<
    EmbeddedRoute,
    {
      cooperative: mongo.BSON.ObjectId;
      parkingLots: EmbeddedParkingLotSeed[];
    }
  >
>;
