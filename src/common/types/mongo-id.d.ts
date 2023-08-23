import { mongo } from 'mongoose';

export type WithMongoId<T> = T & {
  _id: mongo.BSON.ObjectId;
};
