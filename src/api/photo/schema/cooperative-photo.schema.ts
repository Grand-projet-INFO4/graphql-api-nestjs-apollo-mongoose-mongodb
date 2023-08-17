import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';

import type { Photo } from './photo.schema';

@Schema({ timestamps: true })
export class CooperativePhoto {
  @Prop({ type: MongooseSchema.ObjectId, required: true, index: true })
  cooperativeId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.ObjectId,
    required: true,
    index: true,
    sparse: true,
  })
  parkingLotId?: Types.ObjectId;
}

export const cooperativePhotoSchema =
  SchemaFactory.createForClass(CooperativePhoto);

export type CooperativePhotoDocument = HydratedDocument<
  Photo & CooperativePhoto
>;
export type CooperativeModel = Model<Photo & CooperativePhoto>;
