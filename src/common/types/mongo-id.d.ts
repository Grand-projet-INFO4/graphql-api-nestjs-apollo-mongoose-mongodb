import { Types, mongo } from 'mongoose';

// Replaces any id field with an "_id" mongo id field during the seeding
export type WithMongoId<T> = T & {
  _id: mongo.BSON.ObjectId;
};

// Overrides the "_id" from a mongo document to a normal id field
export type SanitizedDocument<T> = Omit<T, '_id'> & {
  id: Types.ObjectId;
};
