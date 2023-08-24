import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ autoCreate: false })
export class EmbeddedPhoto {
  @Prop({ type: String, required: true })
  filename: string;

  @Prop()
  description?: string;
}

export const embeddedPhotoSchema = SchemaFactory.createForClass(EmbeddedPhoto);

export type EmbeddedPhotoDocument = HydratedDocument<EmbeddedPhoto>;
