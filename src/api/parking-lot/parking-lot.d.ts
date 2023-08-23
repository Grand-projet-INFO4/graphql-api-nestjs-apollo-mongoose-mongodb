import { mongo } from 'mongoose';

import { WithMongoId } from 'src/common/types/mongo-id';
import { EmbeddedParkingLot } from './schema';
import { ReplaceFields } from 'src/common/types/utils';
import { CitySeederPayload } from '../city/city.seeder';

export type EmbeddedParkingLotSeed = WithMongoId<
  ReplaceFields<
    EmbeddedParkingLot,
    {
      city: CitySeederPayload;
      cooperative: mongo.BSON.ObjectId;
      busStation?: mongo.BSON.ObjectId;
    }
  >
>;
