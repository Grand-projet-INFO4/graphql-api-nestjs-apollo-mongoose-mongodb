import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { EmbeddedCityDocument, embeddedCitySchema } from 'src/api/city/schema';

@Schema({ autoCreate: false, timestamps: false })
export class TripPath {
  // The trip's departure city
  @Prop({ type: embeddedCitySchema, required: true })
  from: EmbeddedCityDocument;

  // The trip's destination city
  @Prop({ type: embeddedCitySchema, required: true })
  to: EmbeddedCityDocument;
}

export const tripPathSchema = SchemaFactory.createForClass(TripPath);
