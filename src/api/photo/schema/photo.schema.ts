import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

// Photo schema discriminator key
export const PHOTO_DISCRIMINATOR_KEY = 'extension';

// Collection name
export const PHOTO_COLLECTION = 'photos';

@Schema({ timestamps: true, discriminatorKey: PHOTO_DISCRIMINATOR_KEY })
export class Photo {
  @Prop({ type: String, required: true, unique: true })
  filename: string;

  @Prop()
  description?: string;
}

export const photoSchema = SchemaFactory.createForClass(Photo);

export type PhotoDocument = HydratedDocument<Photo>;
export type PhotoModel = Model<Photo>;
