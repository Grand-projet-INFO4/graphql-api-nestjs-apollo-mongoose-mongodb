import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  EmbeddedRegionDocument,
  embeddedRegionSchema,
} from 'src/api/region/schema';

@Schema({ autoCreate: false })
export class EmbeddedCity {
  @Prop({ type: String, required: true })
  cityName: string;

  @Prop({ type: embeddedRegionSchema, required: true })
  region: EmbeddedRegionDocument;

  @Prop()
  weight?: number;
}

export const embeddedCitySchema = SchemaFactory.createForClass(EmbeddedCity);

export type EmbeddedCityDocument = HydratedDocument<EmbeddedCity>;
